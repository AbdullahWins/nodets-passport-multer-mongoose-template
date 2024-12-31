// src/interfaces/headTeacher/headTeacher.interface.ts
import { Model } from "mongoose";
import { ICommonSchema } from "../../common/common/common.interface";

// headTeacher interface
export interface IHeadTeacher extends ICommonSchema {
  // Basic Information
  school_uid: string;
  head_teacher_index: number;
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

// headTeacher create interface
export interface IHeadTeacherCreate {
  school_uid: string;
  head_teacher_index: number;
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

// headTeacher update interface
export interface IHeadTeacherUpdate {
  school_uid?: string | undefined;
  headTeacher_index?: number | undefined;
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

// headTeacher sign-in interface
export interface IHeadTeacherSignIn {
  school_uid: string;
  username: string;
  password: string;
}

// headTeacher schema methods
export interface IHeadTeacherModel extends Model<IHeadTeacher> {}

// headTeacher document interface
export interface IHeadTeacherDocument extends IHeadTeacher, Document {}
