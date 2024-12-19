// src/services/errorHandler/errorStrategies/api.error.ts
import { ApiError } from "../..";

export const handleApiErrorResponse = (error: ApiError) => {
  // Don't create a new error, just return the response structure
  return {
    statusCode: error.statusCode,
    message: error.message,
    errorMessages: error.stack,
    success: false,
    data: null,
    meta: null,
  };
};
