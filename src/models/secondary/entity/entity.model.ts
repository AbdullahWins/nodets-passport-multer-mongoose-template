import moment from "moment";
import { Schema } from "mongoose";
import { IEntity } from "../../../interfaces";

// Define the Entity schema
export const EntitySchema = new Schema<IEntity>({
  school_uid: {
    type: String,
    required: [true, "School UID is required"],
  },
  entity_name: {
    type: String,
    required: [true, "Name is required"],
  },
  entity_password: {
    type: String,
    required: [true, "Password is required"],
  },
  entity_email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
  },
  entity_image: {
    type: String,
    required: [true, "Image is required"],
  },
  entity_address: {
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
