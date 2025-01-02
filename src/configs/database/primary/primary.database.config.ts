//src/config/database/primary/primary.database.config.ts
export const primaryDatabaseOptions = {
  writeConcern: { w: 1 },

  maxPoolSize: 10,

  minPoolSize: 5,

  serverSelectionTimeoutMS: 5000,

  authSource: "admin",
};
