// src/dtos/schoolUsersMapping/schoolUsersMapping.dto.ts
import { Types } from "mongoose";
import { ISchoolUsersMapping } from "../../../interfaces";

// Base SchoolUsersMapping DTO
export class SchoolUsersMappingDto implements Partial<ISchoolUsersMapping> {
  _id: Types.ObjectId;
  email: string;
  school_name: string;
  school_image: string;
  school_id: string;
  db_name: string;

  constructor(schoolUsersMapping: ISchoolUsersMapping) {
    this._id = schoolUsersMapping._id!;
    this.email = schoolUsersMapping.email;
    this.school_name = schoolUsersMapping.school_name;
    this.school_image = schoolUsersMapping.school_image;
    this.school_id = schoolUsersMapping.school_id;
    this.db_name = schoolUsersMapping.db_name;
  }
}

//add schoolUsersMapping DTO
export class SchoolUsersMappingAddDto extends SchoolUsersMappingDto {
  constructor(schoolUsersMapping: ISchoolUsersMapping) {
    super(schoolUsersMapping);
  }
}

// DTO for schoolUsersMapping response after signup/signin
export class SchoolUsersMappingResponseDto extends SchoolUsersMappingDto {
  constructor(schoolUsersMapping: ISchoolUsersMapping) {
    super(schoolUsersMapping);
  }
}
