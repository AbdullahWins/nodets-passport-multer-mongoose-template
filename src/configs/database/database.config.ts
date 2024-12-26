// src/configs/database/database.config.ts
import mongoose from "mongoose";
import { environment } from "../environment/environment.config";
import { errorLogger, infoLogger } from "../../cores";
import { staticProps } from "../../utils";
import { secondaryDatabaseOptions } from "./secondary/secondary.database.config";
import { primaryDatabaseOptions } from "./primary/primary.database.config";
import { School } from "../../models";

// Primary DB Connection
export const connectToPrimaryDB = async () => {
  const uri = environment.db.MONGODB_PRIMARY_DB_URI;
  try {
    await mongoose.connect(uri, primaryDatabaseOptions);
    infoLogger.info(staticProps.database.CONNECTION_SUCCESS_PRIMARY);
    return true;
  } catch (error) {
    errorLogger.error(
      `Error connecting to Primary DB: ${
        error instanceof Error ? error.message : "unknown"
      }`
    );
    process.exit(1);
  }
};

// Simple ping document insertion
export const addPingToSchoolDB = async (dbName: string) => {
  try {
    const schoolDBConnection = schoolDBConnections.get(dbName);

    if (schoolDBConnection) {
      const collection = schoolDBConnection.collection("pingCollection");

      // Insert a simple ping document
      await collection.insertOne({
        ping: "Connection is working",
        timestamp: new Date(),
      });
      infoLogger.info(`Ping added to secondary DB: ${dbName}`);
    } else {
      errorLogger.error(`No connection found for DB: ${dbName}`);
    }
  } catch (error) {
    errorLogger.error(
      `Error adding ping to DB ${dbName}: ${
        error instanceof Error ? error.message : "unknown"
      }`
    );
  }
};

// Map to store the connections for secondary databases (per school)
const schoolDBConnections: Map<string, mongoose.Connection> = new Map();

// Function to connect to secondary DB for each school, dynamically
export const connectToSchoolDB = async (dbName: string) => {
  if (schoolDBConnections.has(dbName)) {
    // Return the existing connection if already created
    return schoolDBConnections.get(dbName);
  }

  // Dynamically create the connection URI using dbName
  const uri = `${environment.db.MONGODB_SECONDARY_DB_URI}/${dbName}`;
  try {
    const connection = await mongoose.createConnection(
      uri,
      secondaryDatabaseOptions
    );
    schoolDBConnections.set(dbName, connection);
    infoLogger.info(`Connected to Secondary DB: ${dbName}`);
    return connection;
  } catch (error) {
    errorLogger.error(
      `Error connecting to Secondary DB ${dbName}: ${
        error instanceof Error ? error.message : "unknown"
      }`
    );
    throw error; // Throw error if connection fails
  }
};

// Connect to the primary and secondary databases (dynamically based on schools)
export const connectToDatabases = async () => {
  try {
    // 1. Connect to Primary DB
    await connectToPrimaryDB();

    // 2. Retrieve db_name from school_users_mapping collection (primary DB)
    const usersMapping = await School.find().lean();

    if (usersMapping && usersMapping.length > 0) {
      // 3. Loop through the mapping and connect to each secondary DB dynamically
      for (const userMapping of usersMapping) {
        const { school_db_name } = userMapping;

        // Connect to each secondary DB (per school)
        await connectToSchoolDB(school_db_name);
        await addPingToSchoolDB(school_db_name);
        infoLogger.info(
          `Successfully connected to secondary DB: ${school_db_name}`
        );
      }
    } else {
      infoLogger.info("No school users mapping found.");
    }
  } catch (error) {
    errorLogger.error(
      `Error during database connections: ${
        error instanceof Error ? error.message : "unknown"
      }`
    );
    throw error;
  }
};
