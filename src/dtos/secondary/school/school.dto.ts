// src/dtos/school/school.dto.ts
import { Types } from "mongoose";
import { ISchool } from "../../../interfaces";

// Base School DTO
export class SchoolDto implements Partial<ISchool> {
  _id: Types.ObjectId;
  name: string;
  image: string;
  address: string;

  constructor(school: ISchool) {
    this._id = school._id!;
    this.name = school.name;
    this.image = school.image;
    this.address = school.address;
  }
}

// DTO for school response after signup/signin
export class SchoolResponseDto extends SchoolDto {
  constructor(school: ISchool) {
    super(school);
  }
}
