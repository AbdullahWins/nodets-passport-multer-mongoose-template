// src/dtos/headTeacher/headTeacher.dto.ts
// src/dtos/headTeacher/headTeacher.dto.ts
import { Types } from "mongoose";
import { IHeadTeacher } from "../../../interfaces";
import { getFileUrl } from "../../../utils";

// Base HeadTeacher DTO
export class HeadTeacherDto implements Partial<IHeadTeacher> {
  _id: Types.ObjectId;
  school_uid: string;
  head_teacher_index: number;
  name: string;
  username: string;
  // password: string;
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

  constructor(headTeacher: IHeadTeacher) {
    this._id = headTeacher._id!;
    this.school_uid = headTeacher.school_uid;
    this.head_teacher_index = headTeacher.head_teacher_index!;
    this.name = headTeacher.name;
    this.username = headTeacher.username;
    // this.password = headTeacher.password;
    this.gender = headTeacher.gender!;
    this.nid_number = headTeacher.nid_number!;
    this.mobile_number = headTeacher.mobile_number!;
    this.status = headTeacher.status!;
    this.contract_type = headTeacher.contract_type!;
    this.highest_qualification = headTeacher.highest_qualification!;
    this.other_qualification = headTeacher.other_qualification!;
    this.subject_specialization = headTeacher.subject_specialization!;
    this.present_address_line = headTeacher.present_address_line!;
    this.present_district = headTeacher.present_district!;
    this.present_upozilla = headTeacher.present_upozilla!;
    this.present_post_office = headTeacher.present_post_office!;
    this.present_post_code = headTeacher.present_post_code!;
    this.permanent_address_line = headTeacher.permanent_address_line!;
    this.permanent_district = headTeacher.permanent_district!;
    this.permanent_upozilla = headTeacher.permanent_upozilla!;
    this.permanent_post_office = headTeacher.permanent_post_office!;
    this.permanent_post_code = headTeacher.permanent_post_code!;
    this.email = headTeacher.email;
    this.tax_identification_number = headTeacher.tax_identification_number!;
    this.image = getFileUrl(headTeacher.image);
  }
}

// DTO for headTeacher response after signup/signin
export class HeadTeacherResponseDto extends HeadTeacherDto {
  constructor(headTeacher: IHeadTeacher) {
    super(headTeacher);
  }
}
