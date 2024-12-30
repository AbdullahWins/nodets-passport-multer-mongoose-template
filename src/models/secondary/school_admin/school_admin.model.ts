import { Schema } from "mongoose";
import { ISchoolAdmin } from "../../../interfaces";
import { getSchoolModel } from "../../../cores";
import { ENUM_SCHOOL_ROLES } from "../../../utils";

// Define the SchoolAdmin schema
export const SchoolAdminSchema = new Schema<ISchoolAdmin>({
  school_uid: {
    type: String,
    required: [true, "School UID is required"],
  },
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  username: {
    type: String,
    required: [true, "Username is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  mobile_number: {
    type: String,
    required: [true, "Mobile Number is required"],
  },
  role: {
    type: String,
    enum: ENUM_SCHOOL_ROLES,
    default: ENUM_SCHOOL_ROLES.SCHOOL_ADMIN,
  },
});

// Export model name for dynamic usage
export const SCHOOL_ADMIN_MODEL_NAME = "SchoolAdmin";

export const getSchoolAdminModel = async (school_uid: string) => {
  return await getSchoolModel<ISchoolAdmin>(
    school_uid,
    SCHOOL_ADMIN_MODEL_NAME,
    SchoolAdminSchema
  );
};
