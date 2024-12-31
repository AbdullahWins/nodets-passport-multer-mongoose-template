import { Schema, Model, Connection } from "mongoose";
import { connectToSchoolDB } from "../../configs";
import { getDatabaseFromUid } from "../../utils";

//get model from school database
export const getSchoolModel = async <T>(
  schoolUid: string,
  modelName: string,
  schema: Schema
): Promise<Model<T>> => {
  const schoolDbName = getDatabaseFromUid(schoolUid);
  const schoolConnection = await connectToSchoolDB(schoolDbName);
  if (!schoolConnection) {
    throw new Error(
      `Failed to connect to the school database: ${schoolDbName}`
    );
  }

  const typedSchoolConnection: Connection = schoolConnection;
  if (typedSchoolConnection.models[modelName]) {
    const cachedModel = typedSchoolConnection.models[modelName] as Model<T>;
    return cachedModel;
  }

  const newModel = typedSchoolConnection.model<T>(modelName, schema);
  return newModel;
};
