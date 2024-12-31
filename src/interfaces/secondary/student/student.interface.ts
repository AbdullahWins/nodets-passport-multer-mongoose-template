// src/interfaces/student/student.interface.ts
import { Model } from "mongoose";
import { ICommonSchema } from "../../common/common/common.interface";

// student interface
export interface IStudent extends ICommonSchema {
  school_uid: string;
  username: string;
  name_english: string;
  name_bangla: string;
  mobile_number: string;
  gender: string;
  date_of_birth: string;
  birth_certificate_number: string;
  email: string;
  nationality: string;
  religion: string;
  blood_group: string;
  disability: string;
  password: string;
  image: string;
  father_name_english: string;
  father_name_bangla: string;
  father_mobile_number: string;
  father_nid_number: string;
  father_profession: string;
  mother_name_english: string;
  mother_name_bangla: string;
  mother_mobile_number: string;
  mother_nid_number: string;
  mother_profession: string;
  present_address_line: string;
  present_address_district: string;
  present_address_upozilla: string;
  present_address_post_office: string;
  present_address_post_code: string;
  permanent_address_line: string;
  permanent_address_district: string;
  permanent_address_upozilla: string;
  permanent_address_post_office: string;
  permanent_address_post_code: string;
  //meta fields
  role: string;
  status: string;
}

// student add interface
export interface IStudentCreate {
  school_uid: string;
  username: string;
  name_english: string;
  name_bangla: string;
  mobile_number: string;
  gender: string;
  date_of_birth: string;
  birth_certificate_number: string;
  email: string;
  nationality: string;
  religion: string;
  blood_group: string;
  disability: string;
  password: string;
  image?: string;
  father_name_english: string;
  father_name_bangla: string;
  father_mobile_number: string;
  father_nid_number: string;
  father_profession: string;
  mother_name_english: string;
  mother_name_bangla: string;
  mother_mobile_number: string;
  mother_nid_number: string;
  mother_profession: string;
  present_address_line: string;
  present_address_district: string;
  present_address_upozilla: string;
  present_address_post_office: string;
  present_address_post_code: string;
  permanent_address_line: string;
  permanent_address_district: string;
  permanent_address_upozilla: string;
  permanent_address_post_office: string;
  permanent_address_post_code: string;
  //meta fields
  role?: string;
  status: string;
}

// student update interface
export interface IStudentUpdate {
  school_uid?: string;
  username?: string;
  name_english?: string;
  name_bangla?: string;
  mobile_number?: string;
  gender?: string;
  date_of_birth?: string;
  birth_certificate_number?: string;
  email?: string;
  nationality?: string;
  religion?: string;
  blood_group?: string;
  disability?: string;
  password?: string;
  image?: string;
  father_name_english?: string;
  father_name_bangla?: string;
  father_mobile_number?: string;
  father_nid_number?: string;
  father_profession?: string;
  mother_name_english?: string;
  mother_name_bangla?: string;
  mother_mobile_number?: string;
  mother_nid_number?: string;
  mother_profession?: string;
  present_address_line?: string;
  present_address_district?: string;
  present_address_upozilla?: string;
  present_address_post_office?: string;
  present_address_post_code?: string;
  permanent_address_line?: string;
  permanent_address_district?: string;
  permanent_address_upozilla?: string;
  permanent_address_post_office?: string;
  permanent_address_post_code?: string;
  //meta fields
  role?: string;
  status: string;
}

export interface IStudentSignIn {
  school_uid: string;
  username: string;
  password: string;
}

// student schema methods
export interface IStudentModel extends Model<IStudent> {}

export interface IStudentDocument extends IStudent, Document {}
