// src/interfaces/teacher/teacher.interface.ts
import { Model } from "mongoose";
import { ICommonSchema } from "../../common/common/common.interface";

// teacher interface
export interface ITeacher extends ICommonSchema {
  // Basic Information
  school_uid: string;
  teacher_index: number;
  name: string;
  username: string;
  gender: string;
  nid_number: string;
  mobile_number: string;
  status: "active" | "inactive";
  contract_type: "permanent" | "temporary";

  // Educational Qualification
  highest_qualification: string;
  other_qualification: string;
  subject_specialization: string;

  // Present Address
  present_address_line: string;
  present_district: string;
  present_upozilla: string;
  present_post_office: string;
  present_post_code: string;

  // Permanent Address
  permanent_address_line: string;
  permanent_district: string;
  permanent_upozilla: string;
  permanent_post_office: string;
  permanent_post_code: string;

  // Other Information
  email: string;
  tax_identification_number: string;

  // Metadata
  image: string;
  password: string;
  role: string;
}

// teacher create interface
export interface ITeacherCreate {
  school_uid: string;
  teacher_index: number;
  name: string;
  username: string;
  gender: string;
  nid_number: string;
  mobile_number: string;
  status: "active" | "inactive";
  contract_type: "permanent" | "temporary";
  highest_qualification: string;
  other_qualification: string;
  subject_specialization: string;
  present_address_line: string;
  present_district: string;
  present_upozilla: string;
  present_post_office: string;
  present_post_code: string;
  permanent_address_line: string;
  permanent_district: string;
  permanent_upozilla: string;
  permanent_post_office: string;
  permanent_post_code: string;
  email: string;
  tax_identification_number: string;
  image: string;
  password: string;
  role: string;
}

// teacher update interface
export interface ITeacherUpdate {
  school_uid?: string | undefined;
  teacher_index?: number | undefined;
  name?: string | undefined;
  username?: string | undefined;
  gender?: string | undefined;
  nid_number?: string | undefined;
  mobile_number?: string | undefined;
  status?: "active" | "inactive" | undefined;
  contract_type?: "permanent" | "temporary" | undefined;
  highest_qualification?: string | undefined;
  other_qualification?: string | undefined;
  subject_specialization?: string | undefined;
  present_address_line?: string | undefined;
  present_district?: string | undefined;
  present_upozilla?: string | undefined;
  present_post_office?: string | undefined;
  present_post_code?: string | undefined;
  permanent_address_line?: string | undefined;
  permanent_district?: string | undefined;
  permanent_upozilla?: string | undefined;
  permanent_post_office?: string | undefined;
  permanent_post_code?: string | undefined;
  email?: string | undefined;
  tax_identification_number?: string | undefined;
  image?: string | undefined;
  password?: string | undefined;
  role?: string | undefined;
}

// teacher sign-in interface
export interface ITeacherSignIn {
  school_uid: string;
  username: string;
  password: string;
}

// teacher schema methods
export interface ITeacherModel extends Model<ITeacher> {}

// teacher document interface
export interface ITeacherDocument extends ITeacher, Document {}
