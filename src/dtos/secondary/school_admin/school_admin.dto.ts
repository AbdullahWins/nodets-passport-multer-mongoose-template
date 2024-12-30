// src/dtos/schoolAdmin/schoolAdmin.dto.ts
import { Types } from "mongoose";
import { ISchoolAdmin } from "../../../interfaces";

// Base SchoolAdmin DTO
export class SchoolAdminDto implements Partial<ISchoolAdmin> {
  _id: Types.ObjectId;
  school_uid: string;
  name: string;
  username: string;
  password: string;
  mobile_number: string;
  role: string;

  constructor(schoolAdmin: ISchoolAdmin) {
    this._id = schoolAdmin._id!;
    this.school_uid = schoolAdmin.school_uid;
    this.name = schoolAdmin.name;
    this.username = schoolAdmin.username;
    this.password = schoolAdmin.password;
    this.mobile_number = schoolAdmin.mobile_number;
    this.role = schoolAdmin.role;
  }
}

// DTO for schoolAdmin response after signup/signin
export class SchoolAdminResponseDto extends SchoolAdminDto {
  constructor(schoolAdmin: ISchoolAdmin) {
    super(schoolAdmin);
  }
}
