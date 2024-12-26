// src/interfaces/teacher/teacher.interface.ts
import { Model } from "mongoose";
import { ICommonSchema } from "../../common/common/common.interface";

// teacher interface
export interface ITeacher extends ICommonSchema {
  name: string;
  image: string;
  address: string;
}

// teacher add interface
export interface ITeacherAdd {
  name: string;
  image: string;
  address: string;
}

// teacher update interface
export interface ITeacherUpdate {
  name?: string;
  image?: string;
  address?: string;
}

// teacher schema methods
export interface ITeacherModel extends Model<ITeacher> {
  isTeacherExistsById(
    teacherId?: string,
    name?: string,
    select?: string
  ): Promise<ITeacher | null>;
}

export interface ITeacherDocument extends ITeacher, Document {}
