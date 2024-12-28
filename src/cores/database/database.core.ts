import { Schema, Model, Connection } from "mongoose";
import { connectToSchoolDB } from "../../configs";

// Cache for models
// const modelCache: { [dbName: string]: { [modelName: string]: Model<any> } } =
//   {};

// Utility to get or define a model on a specific school database connection
export const getSchoolModel = async <T>(
  schoolDbName: string,
  modelName: string,
  schema: Schema<T>
): Promise<Model<T>> => {
  // Check if the model is already cached
  // if (modelCache[schoolDbName]?.[modelName]) {
  //   return modelCache[schoolDbName][modelName] as Model<T>;
  // }

  // Get the connection to the school's database
  const schoolConnection = await connectToSchoolDB(schoolDbName);

  if (!schoolConnection) {
    throw new Error(
      `Failed to connect to the school database: ${schoolDbName}`
    );
  }

  const typedSchoolConnection: Connection = schoolConnection;

  // Cache the models for reuse
  // if (!modelCache[schoolDbName]) {
  //   modelCache[schoolDbName] = {};
  // }

  // Check if the model is already defined on the connection
  if (typedSchoolConnection.models[modelName]) {
    const cachedModel = typedSchoolConnection.models[modelName] as Model<T>;
    // modelCache[schoolDbName][modelName] = cachedModel;
    return cachedModel;
  }

  // Define the model and cache it
  const newModel = typedSchoolConnection.model<T>(modelName, schema);
  // modelCache[schoolDbName][modelName] = newModel;
  return newModel;
};
