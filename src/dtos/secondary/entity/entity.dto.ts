// src/dtos/entity/entity.dto.ts
import { Types } from "mongoose";
import { IEntity } from "../../../interfaces";
import { getFileUrl } from "../../../utils";

// Base Entity DTO
export class EntityDto implements Partial<IEntity> {
  _id: Types.ObjectId;
  school_uid: string;
  entity_name: string;
  entity_email: string;
  entity_image: string;
  entity_address: string;

  constructor(entity: IEntity) {
    this._id = entity._id!;
    this.school_uid = entity.school_uid;
    this.entity_name = entity.entity_name;
    this.entity_email = entity.entity_email;
    this.entity_image = getFileUrl(entity.entity_image);
    this.entity_address = entity.entity_address;
  }
}

// DTO for entity response after signup/signin
export class EntityResponseDto extends EntityDto {
  constructor(entity: IEntity) {
    super(entity);
  }
}
