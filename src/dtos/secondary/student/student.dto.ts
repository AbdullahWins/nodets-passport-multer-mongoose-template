// src/dtos/student/student.dto.ts
// src/dtos/student/student.dto.ts
import { Types } from "mongoose";
import { IStudent } from "../../../interfaces";
import { getFileUrl } from "../../../utils";

// Base Student DTO
export class StudentDto implements Partial<IStudent> {
  _id: Types.ObjectId;
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

  constructor(student: IStudent) {
    this._id = student._id!;
    this.school_uid = student.school_uid;
    this.username = student.username;
    this.name_english = student.name_english;
    this.name_bangla = student.name_bangla;
    this.mobile_number = student.mobile_number;
    this.gender = student.gender;
    this.date_of_birth = student.date_of_birth;
    this.birth_certificate_number = student.birth_certificate_number;
    this.email = student.email;
    this.nationality = student.nationality;
    this.religion = student.religion;
    this.blood_group = student.blood_group;
    this.disability = student.disability;
    this.password = student.password;
    this.image = getFileUrl(student.image);
    this.father_name_english = student.father_name_english;
    this.father_name_bangla = student.father_name_bangla;
    this.father_mobile_number = student.father_mobile_number;
    this.father_nid_number = student.father_nid_number;
    this.father_profession = student.father_profession;
    this.mother_name_english = student.mother_name_english;
    this.mother_name_bangla = student.mother_name_bangla;
    this.mother_mobile_number = student.mother_mobile_number;
    this.mother_nid_number = student.mother_nid_number;
    this.mother_profession = student.mother_profession;
    this.present_address_line = student.present_address_line;
    this.present_address_district = student.present_address_district;
    this.present_address_upozilla = student.present_address_upozilla;
    this.present_address_post_office = student.present_address_post_office;
    this.present_address_post_code = student.present_address_post_code;
    this.permanent_address_line = student.permanent_address_line;
    this.permanent_address_district = student.permanent_address_district;
    this.permanent_address_upozilla = student.permanent_address_upozilla;
    this.permanent_address_post_office = student.permanent_address_post_office;
    this.permanent_address_post_code = student.permanent_address_post_code;
  }
}

// DTO for student response after signup/signin
export class StudentResponseDto extends StudentDto {
  constructor(student: IStudent) {
    super(student);
  }
}
