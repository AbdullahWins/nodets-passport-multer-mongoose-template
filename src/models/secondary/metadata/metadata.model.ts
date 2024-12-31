import { Schema } from "mongoose";
import { IMetadata } from "../../../interfaces";
import { getSchoolModel } from "../../../cores";

// Define the Metadata schema
export const MetadataSchema = new Schema<IMetadata>({
  school_uid: {
    type: String,
    required: [true, "School UID is required"],
  },
  school_name: {
    type: String,
    required: [true, "Name is required"],
  },
  school_db_name: {
    type: String,
    required: [true, "Password is required"],
  },
});

const METADATA_MODEL_NAME = "Metadata";

// Export model for dynamic usage
export const getMetadataModel = async (school_uid: string) => {
  return await getSchoolModel<IMetadata>(
    school_uid,
    METADATA_MODEL_NAME,
    MetadataSchema
  );
};
