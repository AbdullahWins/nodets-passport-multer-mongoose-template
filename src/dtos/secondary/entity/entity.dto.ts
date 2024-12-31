// src/dtos/entity/entity.dto.ts
import { Types } from "mongoose";
import { IEntity } from "../../../interfaces";
import { getFileUrl } from "../../../utils";

// Base Entity DTO
export class EntityDto implements Partial<IEntity> {
  _id: Types.ObjectId;
  school_uid: string;
  name: string;
  email: string;
  // password: string;
  image: string;
  address: string;

  constructor(entity: IEntity) {
    this._id = entity._id!;
    this.school_uid = entity.school_uid;
    this.name = entity.name;
    this.email = entity.email;
    // this.password = entity.password;
    this.image = getFileUrl(entity.image);
    this.address = entity.address;
  }
}

// DTO for entity response after signup/signin
export class EntityResponseDto extends EntityDto {
  constructor(entity: IEntity) {
    super(entity);
  }
}
