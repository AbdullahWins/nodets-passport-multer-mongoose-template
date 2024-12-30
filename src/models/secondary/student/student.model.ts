import { Schema } from "mongoose";
import { IStudent } from "../../../interfaces";
import { getSchoolModel } from "../../../cores";
import { ENUM_SCHOOL_ROLES } from "../../../utils";

// Define the Student schema
export const StudentSchema = new Schema<IStudent>({
  school_uid: {
    type: String,
    required: [true, "School UID is required"],
  },
  username: {
    type: String,
    required: [true, "Username is required"],
  },
  name_english: {
    type: String,
    required: [true, "Name is required"],
  },
  name_bangla: {
    type: String,
    required: [true, "Name is required"],
  },
  mobile_number: {
    type: String,
    required: [true, "Mobile number is required"],
  },
  gender: {
    type: String,
    required: [true, "Gender is required"],
  },
  date_of_birth: {
    type: String,
    required: [true, "Date of birth is required"],
  },
  birth_certificate_number: {
    type: String,
    required: [true, "Birth certificate number is required"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
  },
  nationality: {
    type: String,
    required: [true, "Nationality is required"],
  },
  religion: {
    type: String,
    required: [true, "Religion is required"],
  },
  blood_group: {
    type: String,
    required: [true, "Religion is required"],
  },
  disability: {
    type: String,
    required: [true, "Religion is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  image: {
    type: String,
    required: [true, "Image is required"],
  },
  //father info
  father_name_english: {
    type: String,
    required: [true, "Name is required"],
  },
  father_name_bangla: {
    type: String,
    required: [true, "Name is required"],
  },
  father_mobile_number: {
    type: String,
    required: [true, "Mobile number is required"],
  },
  father_nid_number: {
    type: String,
    required: [true, "Father NID number is required"],
  },
  father_profession: {
    type: String,
    required: [true, "Father profession is required"],
  },
  //mother info
  mother_name_english: {
    type: String,
    required: [true, "Name is required"],
  },
  mother_name_bangla: {
    type: String,
    required: [true, "Name is required"],
  },
  mother_mobile_number: {
    type: String,
    required: [true, "Mobile number is required"],
  },
  mother_nid_number: {
    type: String,
    required: [true, "Mother NID number is required"],
  },
  mother_profession: {
    type: String,
    required: [true, "Mother profession is required"],
  },
  //present address
  present_address_line: {
    type: String,
    required: [true, "Present address line is required"],
  },
  present_address_district: {
    type: String,
    required: [true, "Present address district is required"],
  },
  present_address_upozilla: {
    type: String,
    required: [true, "Present address post office is required"],
  },
  present_address_post_office: {
    type: String,
    required: [true, "Present address post office is required"],
  },
  present_address_post_code: {
    type: String,
    required: [true, "Present address post code is required"],
  },
  //permanent address
  permanent_address_line: {
    type: String,
    required: [true, "Permanent address line is required"],
  },
  permanent_address_district: {
    type: String,
    required: [true, "Permanent address district is required"],
  },
  permanent_address_upozilla: {
    type: String,
    required: [true, "Permanent address post office is required"],
  },
  permanent_address_post_office: {
    type: String,
    required: [true, "Permanent address post office is required"],
  },
  permanent_address_post_code: {
    type: String,
    required: [true, "Permanent address post code is required"],
  },
  //meta fields
  role: {
    type: String,
    enum: [ENUM_SCHOOL_ROLES.STUDENT],
    default: ENUM_SCHOOL_ROLES.STUDENT,
    required: [true, "Role is required"],
  },
});

// Export model name for dynamic usage
export const STUDENT_MODEL_NAME = "Student";

export const getStudentModel = async (school_uid: string) => {
  return await getSchoolModel<IStudent>(
    school_uid,
    STUDENT_MODEL_NAME,
    StudentSchema
  );
};
