import { Schema } from "mongoose";
import { ITeacher } from "../../../interfaces";
import { getSchoolModel } from "../../../cores";
import { ENUM_SHRADED_DATABASE_NAMES } from "../../../utils";

// Define the Teacher schema
export const TeacherSchema = new Schema<ITeacher>({
  //basic information
  image: {
    type: String,
    required: [true, "Image is required"],
  },
  school_uid: {
    type: String,
    required: [true, "School UID is required"],
  },
  teacher_index: {
    type: Number,
    required: [true, "Teacher Index is required"],
  },
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  username: {
    type: String,
    required: [true, "Username is required"],
  },
  gender: {
    type: String,
    required: [true, "Gender is required"],
  },
  nid_number: {
    type: String,
    required: [true, "NID Number is required"],
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    required: [true, "Status is required"],
  },
  contract_type: {
    type: String,
    enum: ["permanent", "temporary"],
    required: [true, "Contract Type is required"],
  },
  //educational_qualification
  highest_qualification: {
    type: String,
    required: [true, "Highest Qualification is required"],
  },
  other_qualification: {
    type: String,
    required: [true, "Other Qualification is required"],
  },
  subject_specialization: {
    type: String,
    required: [true, "Subject Specialization is required"],
  },

  //present_address
  present_address_line: {
    type: String,
    required: [true, "Present Address is required"],
  },
  present_district: {
    type: String,
    required: [true, "Present District is required"],
  },
  present_upozilla: {
    type: String,
    required: [true, "Present Upozilla is required"],
  },
  present_post_office: {
    type: String,
    required: [true, "Present Post Office is required"],
  },
  present_post_code: {
    type: String,
    required: [true, "Present Post Code is required"],
  },

  //permanent_address
  permanent_address_line: {
    type: String,
    required: [true, "Permanent Address is required"],
  },
  permanent_district: {
    type: String,
    required: [true, "Permanent District is required"],
  },
  permanent_upozilla: {
    type: String,
    required: [true, "Permanent Upozilla is required"],
  },
  permanent_post_office: {
    type: String,
    required: [true, "Permanent Post Office is required"],
  },
  permanent_post_code: {
    type: String,
    required: [true, "Permanent Post Code is required"],
  },

  //other_information
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  mobile_number: {
    type: String,
    required: [true, "Mobile Number is required"],
  },
  tax_identification_number: {
    type: String,
    required: [true, "Tax Identification Number is required"],
  },

  //meta data
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  role: {
    type: String,
    required: [true, "Role is required"],
  },
});

export const getTeacherModel = async (school_uid: string) => {
  return await getSchoolModel<ITeacher>(
    school_uid,
    ENUM_SHRADED_DATABASE_NAMES.TEACHER_MODEL_NAME,
    TeacherSchema
  );
};
