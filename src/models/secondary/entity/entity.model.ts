import moment from "moment";
import { Schema } from "mongoose";
import { IEntity } from "../../../interfaces";
import { getSchoolModel } from "../../../cores";

// Define the Entity schema
export const EntitySchema = new Schema<IEntity>({
  school_uid: {
    type: String,
    required: [true, "School UID is required"],
  },
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
  },
  image: {
    type: String,
    required: [true, "Image is required"],
  },
  address: {
    type: String,
    required: [true, "Address is required"],
  },
  createdAt: {
    type: Number,
    default: () => moment().utc().unix(),
  },
  updatedAt: {
    type: Number,
    default: () => moment().utc().unix(),
  },
});

// Export model name for dynamic usage
export const ENTITY_MODEL_NAME = "Entity";

export const getEntityModel = async (school_uid: string) => {
  return await getSchoolModel<IEntity>(
    school_uid,
    ENTITY_MODEL_NAME,
    EntitySchema
  );
};

