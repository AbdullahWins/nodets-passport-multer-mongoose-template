// src/configs/database/database.config.ts
import mongoose from "mongoose";
import { errorLogger, infoLogger } from "../../cores";
import { staticProps } from "../../utils";
import { School } from "../../models";
import { environment } from "../environment";
import { primaryDatabaseOptions } from "./primary";
import { secondaryDatabaseOptions } from "./secondary";

// Primary DB Connection
const connectToPrimaryDB = async () => {
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

    // 2. Retrieve db_name from school collection (primary DB)
    const schoolFromPrimaryDb = await School.find().lean();

    if (schoolFromPrimaryDb && schoolFromPrimaryDb.length > 0) {
      // 3. Loop through the mapping and connect to each secondary DB dynamically
      for (const school of schoolFromPrimaryDb) {
        const { school_db_name } = school;

        // Connect to each secondary DB (per school)
        await connectToSchoolDB(school_db_name);
      }
    } else {
      infoLogger.info("No school mapping found.");
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
