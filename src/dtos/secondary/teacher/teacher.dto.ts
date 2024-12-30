// src/dtos/teacher/teacher.dto.ts
// src/dtos/teacher/teacher.dto.ts
import { Types } from "mongoose";
import { ITeacher } from "../../../interfaces";
import { getFileUrl } from "../../../utils";

// Base Teacher DTO
export class TeacherDto implements Partial<ITeacher> {
  _id: Types.ObjectId;
  school_uid: string;
  teacher_index: number;
  name: string;
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

  constructor(teacher: ITeacher) {
    this._id = teacher._id!;
    this.school_uid = teacher.school_uid;
    this.teacher_index = teacher.teacher_index!;
    this.name = teacher.name;
    this.gender = teacher.gender!;
    this.nid_number = teacher.nid_number!;
    this.mobile_number = teacher.mobile_number!;
    this.status = teacher.status!;
    this.contract_type = teacher.contract_type!;
    this.highest_qualification = teacher.highest_qualification!;
    this.other_qualification = teacher.other_qualification!;
    this.subject_specialization = teacher.subject_specialization!;
    this.present_address_line = teacher.present_address_line!;
    this.present_district = teacher.present_district!;
    this.present_upozilla = teacher.present_upozilla!;
    this.present_post_office = teacher.present_post_office!;
    this.present_post_code = teacher.present_post_code!;
    this.permanent_address_line = teacher.permanent_address_line!;
    this.permanent_district = teacher.permanent_district!;
    this.permanent_upozilla = teacher.permanent_upozilla!;
    this.permanent_post_office = teacher.permanent_post_office!;
    this.permanent_post_code = teacher.permanent_post_code!;
    this.email = teacher.email;
    this.tax_identification_number = teacher.tax_identification_number!;
    this.image = getFileUrl(teacher.image);
  }
}

// DTO for teacher response after signup/signin
export class TeacherResponseDto extends TeacherDto {
  constructor(teacher: ITeacher) {
    super(teacher);
  }
}
