// src/interfaces/student/student.interface.ts
import { Model } from "mongoose";
import { ICommonSchema } from "../../common/common/common.interface";

// student interface
export interface IStudent extends ICommonSchema {
  name: string;
  image: string;
  address: string;
}

// student add interface
export interface IStudentAdd {
  name: string;
  image: string;
  address: string;
}

// student update interface
export interface IStudentUpdate {
  name?: string;
  image?: string;
  address?: string;
}

// student schema methods
export interface IStudentModel extends Model<IStudent> {
  isStudentExistsById(
    studentId?: string,
    name?: string,
    select?: string
  ): Promise<IStudent | null>;
}

export interface IStudentDocument extends IStudent, Document {}
