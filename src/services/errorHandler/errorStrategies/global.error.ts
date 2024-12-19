// src/services/errorHandler/errorStrategies/global.error.ts
import httpStatus from "http-status";
import { staticProps } from "../../../utils/constants/static.constant";
import { handleApiErrorResponse } from "./api.error";
import { IErrorResponse } from "../../../interfaces";
import { MongoServerError } from "mongodb";
import { MongooseError } from "mongoose";
import { ApiError } from "../..";
import {
  handleMongooseError,
  handleMongooseServerError,
} from "./mongoose.error";
import { MulterError } from "multer";
import { handleMulterError } from "./multer.error";
import { handleZodError } from "./zod.error";

export const getErrorResponse = (error: any): IErrorResponse => {
  //handle ApiError
  if (error instanceof ApiError) {
    handleApiErrorResponse(error);
  }

  //handle mongoose error
  if (error instanceof MongoServerError) {
    return handleMongooseServerError(error);
  }

  //handle mongoose error
  if (error instanceof MongooseError) {
    return handleMongooseError(error);
  }

  //handle multer error
  if (error instanceof MulterError) {
    return handleMulterError(error);
  }

  //handle zod error
  if (error instanceof Error && error.name === "ZodError") {
    return handleZodError(error);
  }

  // Handle generic errors
  return {
    statusCode: error?.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
    message: error?.message || staticProps.common.SOMETHING_WENT_WRONG,
    errorMessages: error?.stack ? [{ message: error.stack }] : [],
    success: false,
    data: null,
    meta: null,
  };
};
