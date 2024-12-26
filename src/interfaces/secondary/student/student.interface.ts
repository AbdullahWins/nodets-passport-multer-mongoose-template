// src/interfaces/student/student.interface.ts
import { Model } from "mongoose";
import { ICommonSchema } from "../../common/common/common.interface";

// student interface
export interface IStudent extends ICommonSchema {
  name: string;
  email: string;
  image: string;
  address: string;
  password: string;
  role: string;
}

// student add interface
export interface IStudentAdd {
  name: string;
  email: string;
  image: string;
  address: string;
  password: string;
  role: string;
}

// student update interface
export interface IStudentUpdate {
  name?: string;
  email?: string;
  image?: string;
  address?: string;
  password?: string;
}

// student schema methods
export interface IStudentModel extends Model<IStudent> {}

export interface IStudentDocument extends IStudent, Document {}
