// src/interfaces/schoolAdmin/schoolAdmin.interface.ts
import { Model } from "mongoose";
import { ICommonSchema } from "../../common/common/common.interface";

// schoolAdmin interface
export interface ISchoolAdmin extends ICommonSchema {
  school_uid: string;
  name: string;
  username: string;
  password: string;
  mobile_number: string;
  role: string;
}

// schoolAdmin add interface
export interface ISchoolAdminCreate {
  school_uid: string;
  name: string;
  username: string;
  password: string;
  mobile_number: string;
  role: string;
}

// schoolAdmin update interface
export interface ISchoolAdminUpdate {
  school_uid: string;
  name?: string | undefined;
  username?: string | undefined;
  password?: string | undefined;
  mobile_number?: string | undefined;
  role?: string | undefined;
}

export interface ISchoolAdminSignIn {
  school_uid: string;
  username: string;
  password: string;
}

// schoolAdmin schema methods
export interface ISchoolAdminModel extends Model<ISchoolAdmin> {}

export interface ISchoolAdminDocument extends ISchoolAdmin, Document {}
