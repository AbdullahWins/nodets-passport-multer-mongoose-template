// src/dtos/school/school.dto.ts
import { Types } from "mongoose";
import { ISchool } from "../../../interfaces";

// Base School DTO
export class SchoolDto implements Partial<ISchool> {
  _id: Types.ObjectId;
  email: string;
  school_name: string;
  school_image: string;
  school_id: string;
  db_name: string;

  constructor(school: ISchool) {
    this._id = school._id!;
    this.email = school.email;
    this.school_name = school.school_name;
    this.school_image = school.school_image;
    this.school_id = school.school_id;
    this.db_name = school.db_name;
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
