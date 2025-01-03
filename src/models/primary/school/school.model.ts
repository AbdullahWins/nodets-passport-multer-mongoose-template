// src/models/primary/school.model.ts
import { Schema, model } from "mongoose";
import moment from "moment";
import {
  ISchool,
  ISchoolDocument,
  ISchoolModel,
} from "../../../interfaces";

// Define the schema for the school_users_mapping collection
const SchoolSchema = new Schema<ISchoolDocument>({
  school_email: {
    type: String,
    required: [true, "Email is required"],
  },
  school_name: {
    type: String,
    required: [true, "School name is required"],
  },
  school_username: {
    type: String,
    unique: true,
    required: [true, "Username is required"],
  },
  school_address: {
    type: String,
    required: [true, "School address is required"],
  },
  school_image: {
    type: String,
    required: [true, "School image is required"],
  },
  school_uid: {
    type: String,
    unique: true,
    required: true,
  },
  school_db_name: {
    type: String,
    unique: true,
    required: true,
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

// Validate that email is unique before saving
SchoolSchema.pre<ISchoolDocument>(
  "save",
  function (next) {
    // You can add custom validation logic here if needed
    next();
  }
);

// Update `updatedAt` field on each update
SchoolSchema.pre<ISchoolDocument>(
  "updateOne",
  function (next) {
    this.updatedAt = moment().utc().unix();
    next();
  }
);

// Check if a user exists by email
SchoolSchema.statics.isUserExistsByEmail = async function (
  email: string
): Promise<ISchool | null> {
  const user = await this.findOne({ email }).lean();
  return user;
};

// Check if a user exists by school ID
SchoolSchema.statics.isUserExistsBySchoolId = async function (
  schoolId: string
): Promise<ISchool | null> {
  const user = await this.findOne({ school_uid: schoolId }).lean();
  return user;
};

// Create a model from the schema
const School = model<
  ISchoolDocument,
  ISchoolModel
>("School", SchoolSchema);

export default School;
