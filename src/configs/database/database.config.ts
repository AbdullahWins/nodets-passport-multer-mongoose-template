//src/configs/database/database.config.ts
import mongoose from "mongoose";
import { environment } from "../environment/environment.config";
import { errorLogger, infoLogger } from "../../services";
import { staticProps } from "../../utils";

export const connectToDatabase = async () => {
  const uri = environment.db.CONNECTION_STRING;
  try {
    await mongoose.connect(uri, {
      // Specify the write concern mode
      writeConcern: { w: "majority" },
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
