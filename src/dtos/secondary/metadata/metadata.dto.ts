// src/dtos/metadata/metadata.dto.ts
import { Types } from "mongoose";
import { IMetadata } from "../../../interfaces";

// Base Metadata DTO
export class MetadataDto implements Partial<IMetadata> {
  _id: Types.ObjectId;
  school_uid: string;
  school_name?: string;
  school_db_name?: string;

  constructor(metadata: IMetadata) {
    this._id = metadata._id!;
    this.school_uid = metadata.school_uid;
    this.school_name = metadata.school_name;
    this.school_db_name = metadata.school_db_name;
  }
}

// DTO for metadata response after signup/signin
export class MetadataResponseDto extends MetadataDto {
  constructor(metadata: IMetadata) {
    super(metadata);
  }
}
