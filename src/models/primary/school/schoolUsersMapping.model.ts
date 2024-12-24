// src/models/primary/schoolUsersMapping.model.ts
import { Schema, model } from "mongoose";
import moment from "moment";
import {
  ISchoolUsersMapping,
  ISchoolUsersMappingDocument,
  ISchoolUsersMappingModel,
} from "../../../interfaces";

// Define the schema for the school_users_mapping collection
const SchoolUsersMappingSchema = new Schema<ISchoolUsersMappingDocument>({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  school_name: {
    type: String,
    required: [true, "School name is required"],
  },
  school_image: {
    type: String,
    required: [true, "School image is required"],
  },
  school_id: {
    type: String,
    required: true,
  },
  db_name: {
    type: String,
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
SchoolUsersMappingSchema.pre<ISchoolUsersMappingDocument>(
  "save",
  function (next) {
    // You can add custom validation logic here if needed
    next();
  }
);

// Update `updatedAt` field on each update
SchoolUsersMappingSchema.pre<ISchoolUsersMappingDocument>(
  "updateOne",
  function (next) {
    this.updatedAt = moment().utc().unix();
    next();
  }
);

// Check if a user exists by email
SchoolUsersMappingSchema.statics.isUserExistsByEmail = async function (
  email: string
): Promise<ISchoolUsersMapping | null> {
  const user = await this.findOne({ email }).lean();
  return user;
};

// Check if a user exists by school ID
SchoolUsersMappingSchema.statics.isUserExistsBySchoolId = async function (
  schoolId: string
): Promise<ISchoolUsersMapping | null> {
  const user = await this.findOne({ school_id: schoolId }).lean();
  return user;
};

// Create a model from the schema
const SchoolUsersMapping = model<
  ISchoolUsersMappingDocument,
  ISchoolUsersMappingModel
>("SchoolUsersMapping", SchoolUsersMappingSchema);

export default SchoolUsersMapping;
