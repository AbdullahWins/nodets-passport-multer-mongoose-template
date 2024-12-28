// src/interfaces/entity/entity.interface.ts
import { Model } from "mongoose";
import { ICommonSchema } from "../../common/common/common.interface";

// entity interface
export interface IEntity extends ICommonSchema {
  school_uid: string;
  entity_name: string;
  entity_email: string;
  entity_image: string;
  entity_address: string;
  entity_password: string;
  entity_role: string;
}

// entity add interface
export interface IEntityCreate {
  school_uid: string;
  entity_name: string;
  entity_email: string;
  entity_image: string;
  entity_address: string;
  entity_password: string;
  entity_role: string;
}

// entity update interface
export interface IEntityUpdate {
  school_uid: string;
  entity_name?: string | undefined;
  entity_email?: string | undefined;
  entity_image?: string | undefined;
  entity_address?: string | undefined;
  entity_password?: string | undefined;
  entity_isEmailVerified?: boolean | undefined;
  entity_role?: string | undefined;
}

export interface IEntitySignIn {
  school_uid: string;
  entity_email: string;
  entity_password: string;
}

// entity schema methods
export interface IEntityModel extends Model<IEntity> {}

export interface IEntityDocument extends IEntity, Document {}
