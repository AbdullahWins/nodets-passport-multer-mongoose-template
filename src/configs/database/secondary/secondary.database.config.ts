//src/config/database/secondary/secondary.database.config.ts

import { W } from "mongodb";

export const secondaryDatabaseOptions = {
  writeConcern: { w: "majority" as W },

  maxPoolSize: 10,

  minPoolSize: 5,

  serverSelectionTimeoutMS: 5000,

  authSource: "admin",
};
