// src/dtos/school/school.dto.ts
import { Types } from "mongoose";
import { ISchool } from "../../../interfaces";

// Base School DTO
export class SchoolDto implements Partial<ISchool> {
  _id: Types.ObjectId;
  school_email: string;
  school_name: string;
  school_address: string;
  school_image: string;
  school_uid: string;
  school_db_name: string;

  constructor(school: ISchool) {
    this._id = school._id!;
    this.school_email = school.school_email;
    this.school_name = school.school_name;
    this.school_address = school.school_address;
    this.school_image = school.school_image;
    this.school_uid = school.school_uid;
    this.school_db_name = school.school_db_name;
  }
}

//add school DTO
export class SchoolAddDto extends SchoolDto {
  constructor(school: ISchool) {
    super(school);
  }
}

// DTO for school response after signup/signin
export class SchoolResponseDto extends SchoolDto {
  constructor(school: ISchool) {
    super(school);
  }
}
