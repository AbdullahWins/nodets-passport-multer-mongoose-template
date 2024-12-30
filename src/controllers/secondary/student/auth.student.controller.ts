import httpStatus from "http-status";
import { Request, Response, RequestHandler } from "express";
import { catchAsync } from "../../../middlewares";
import { sendResponse, staticProps } from "../../../utils";
import { signInStudentService, signUpStudentService } from "../../../services";
import { IMulterFiles } from "../../../interfaces";

// SignUpStudent Handler
export const SignUpStudent: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const parsedData = req.body;
    const { single } = req.files as IMulterFiles;

    const result = await signUpStudentService(parsedData, single);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: staticProps.common.CREATED,
      data: result,
    });
  }
);

// SignInStudent Handler
export const SignInStudent: RequestHandler = catchAsync(async (req, res) => {
  const parsedData = req.body;

  const result = await signInStudentService(parsedData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: staticProps.common.LOGGED_IN,
    data: result,
  });
});
