// src/interfaces/admin/admin.interface.ts
import { Model } from "mongoose";
import { ICommonSchema } from "../../common";

// admin interface
export interface IAdmin extends ICommonSchema {
  school_uid: string;
  name: string;
  email: string;
  image: string;
  password: string;
  role: string;
  assigned_schools: string[];
}

// admin signup interface
export interface IAdminSignup {
  name: string;
  email: string;
  image: string;
  password: string;
  role: string;
  assigned_schools: string[];
}

// admin login interface
export interface IAdminSignin {
  school_uid: string;
  email: string;
  password: string;
}

// admin create interface
export interface IAdminCreate {
  school_uid?: string;
  name: string;
  email: string;
  image: string;
  password: string;
  role?: string;
  assigned_schools?: string[];
}

// admin update interface
export interface IAdminUpdate {
  name?: string;
  email?: string;
  image?: string;
  password?: string;
  role?: string;
  assigned_schools?: string[];
}

// admin schema methods
export interface IAdminModel extends Model<IAdmin> {}

export interface IAdminDocument extends IAdmin, Document {}
