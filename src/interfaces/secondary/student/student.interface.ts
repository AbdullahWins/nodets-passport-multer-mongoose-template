// src/interfaces/student/student.interface.ts
import { Model } from "mongoose";
import { ICommonSchema } from "../../common/common/common.interface";

// student interface
export interface IStudent extends ICommonSchema {
  school_uid: string;
  student_name: string;
  student_email: string;
  student_image: string;
  student_address: string;
  student_password: string;
  student_role: string;
}

// student add interface
export interface IStudentCreate {
  school_uid: string;
  student_name: string;
  student_email: string;
  student_image: string;
  student_address: string;
  student_password: string;
  student_role: string;
}

// student update interface
export interface IStudentUpdate {
  school_uid: string;
  student_name?: string | undefined;
  student_email?: string | undefined;
  student_image?: string | undefined;
  student_address?: string | undefined;
  student_password?: string | undefined;
  student_isEmailVerified?: boolean | undefined;
  student_role?: string | undefined;
}

export interface IStudentSignIn {
  school_uid: string;
  student_email: string;
  student_password: string;
}

// student schema methods
export interface IStudentModel extends Model<IStudent> {}

export interface IStudentDocument extends IStudent, Document {}
