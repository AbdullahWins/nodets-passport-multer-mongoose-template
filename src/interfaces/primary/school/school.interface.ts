// src/interfaces/school/school.interface.ts
import { Model } from "mongoose";
import { ICommonSchema } from "../../common/common.interface";

// school interface
export interface ISchool extends ICommonSchema {
  school_email: string;
  school_name: string;
  school_address: string;
  school_image: string;
  school_uid: string;
  school_db_name: string;
}

// school add interface
export interface ISchoolAdd {
  school_email: string;
  school_name: string;
  school_address: string;
  school_image: string;
  school_uid: string;
  school_db_name: string;
}

// school update interface
export interface ISchoolUpdate {
  school_email?: string;
  school_name?: string;
  school_address?: string;
  school_image?: string;
  school_uid?: string;
  school_db_name?: string;
}

// school schema methods
export interface ISchoolModel extends Model<ISchool> {
  isSchoolExistsById(
    school_id: string,
    select?: string
  ): Promise<ISchool | null>;
}

export interface ISchoolDocument
  extends ISchool,
    Document {}
