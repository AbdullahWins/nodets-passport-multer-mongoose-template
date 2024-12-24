// src/interfaces/school/school.interface.ts
import { Model } from "mongoose";
import { ICommonSchema } from "../../common/common.interface";

// school interface
export interface ISchool extends ICommonSchema {
  name: string;
  image: string;
  address: string;
}

// school add interface
export interface ISchoolAdd {
  name: string;
  image: string;
  address: string;
}

// school update interface
export interface ISchoolUpdate {
  name?: string;
  image?: string;
  address?: string;
}

// school schema methods
export interface ISchoolModel extends Model<ISchool> {
  isSchoolExistsById(
    schoolId?: string,
    name?: string,
    select?: string
  ): Promise<ISchool | null>;
}

export interface ISchoolDocument extends ISchool, Document {}
