// src/interfaces/common/common.interface.ts
import { Types } from "mongoose";

// common schema
export interface ICommonSchema {
  _id?: Types.ObjectId;
  createdAt?: number;
  updatedAt?: number;
  __v?: number;
}

export interface IOtpData {
  email: string;
  otp: string;
}

export interface IErrorMessage {
  path?: string;
  message: string;
}

export interface IErrorResponse {
  statusCode: number;
  message: string;
  errorMessages?: IErrorMessage[];
  success: boolean;
  data: null;
  meta: null;
}

export interface IApiReponse<T> {
  statusCode: number;
  message?: string | null;
  success?: boolean;
  data?: T | null;
  meta?: object | null;
}

export interface IKeyValueObject {
  [key: string]: string | undefined;
}
