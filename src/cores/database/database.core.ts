import { Model } from "mongoose";
import { connectToSchoolDB } from "../../configs";

// Function to get or define a model on a specific school DB connection
export const getSchoolModel = async <T>(
  schoolDbName: string,
  model: Model<T>
): Promise<Model<T>> => {
  // Get the connection to the school DB
  const schoolConnection = await connectToSchoolDB(schoolDbName);

  if (!schoolConnection) {
    throw new Error(`No connection found for school: ${schoolDbName}`);
  }

  // Extract the model name and schema from the provided model
  const modelName = model.modelName;
  const schema = model.schema;

  // Check if the model is already defined for this connection
  if (schoolConnection.models[modelName]) {
    return schoolConnection.models[modelName] as Model<T>;
  }

  // Define and return the model
  return schoolConnection.model<T>(modelName, schema);
};
