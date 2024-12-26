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

// Map to store the connections for secondary databases (per school)
const schoolDBConnections: Map<string, mongoose.Connection> = new Map();

// Function to connect to secondary DB for each school, dynamically
export const connectToSchoolDB = async (dbName: string) => {
  if (schoolDBConnections.has(dbName)) {
    // Return the existing connection if already created
    infoLogger.info(`Reusing existing connection for DB: ${dbName}`);
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
    infoLogger.info(`Connected to school shread: ${dbName}`);
    return connection;
  } catch (error) {
    errorLogger.error(
      `Error connecting to school shread ${dbName}: ${
        error instanceof Error ? error.message : "unknown"
      }`
    );
    throw error;
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
