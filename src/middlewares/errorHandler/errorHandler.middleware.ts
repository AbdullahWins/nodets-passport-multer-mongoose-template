//src/middlewares/errorHandler/errorHandler.middleware.ts
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { environment } from "../../configs";
import { errorLogger, getErrorResponse } from "../../services";

export const globalErrorHandler: ErrorRequestHandler = (
  error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const errorResponse = getErrorResponse(error);
  const isProduction = environment.server.SERVER_ENV === "production";

  errorLogger.error(error.message);

  if (isProduction) {
    return res.status(errorResponse.statusCode).json({
      statusCode: errorResponse.statusCode,
      message: errorResponse.message,
      success: false,
      data: null,
    });
  } else {
    return res.status(errorResponse.statusCode).json({
      statusCode: errorResponse.statusCode,
      success: errorResponse.success,
      message: errorResponse.message,
      errorMessages: errorResponse.errorMessages,
      data: errorResponse.data,
    });
  }
};
