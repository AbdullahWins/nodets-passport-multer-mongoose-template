// src/interfaces/entity/entity.interface.ts
import { Model } from "mongoose";
import { ICommonSchema } from "../../common/common/common.interface";

// entity interface
export interface IEntity extends ICommonSchema {
  school_uid: string;
  name: string;
  email: string;
  image: string;
  address: string;
  password: string;
  role: string;
}

// entity add interface
export interface IEntityCreate {
  school_uid: string;
  name: string;
  email: string;
  image: string;
  address: string;
  password: string;
  role: string;
}

// entity update interface
export interface IEntityUpdate {
  school_uid: string;
  name?: string | undefined;
  email?: string | undefined;
  image?: string | undefined;
  address?: string | undefined;
  password?: string | undefined;
  isEmailVerified?: boolean | undefined;
  role?: string | undefined;
}

export interface IEntitySignIn {
  school_uid: string;
  email: string;
  password: string;
}

// entity schema methods
export interface IEntityModel extends Model<IEntity> {}

export interface IEntityDocument extends IEntity, Document {}
