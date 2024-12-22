//src/configs/database/database.config.ts
import mongoose from "mongoose";
import { environment } from "../environment/environment.config";
import { errorLogger, infoLogger } from "../../services";
import { staticProps } from "../../utils";

export const connectToDatabase = async () => {
  const uri = environment.db.MONGODB_URI;
  console.log("Connecting to MongoDB with URI:", uri); // Log the URI for debugging
  try {
    await mongoose.connect(uri, {
      writeConcern: { w: "majority" },
      maxPoolSize: 50,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
    });
    infoLogger.info(staticProps.database.CONNECTION_SUCCESS);
  } catch (error) {
    errorLogger.error(
      `Error connecting database: ${
        error instanceof Error ? error.message : "unknown"
      }`
    );
    process.exit(1);
  }
};
