import httpStatus from "http-status";
import { Request, Response, RequestHandler } from "express";
import { catchAsync } from "../../../middlewares";
import { sendResponse, staticProps } from "../../../utils";
import { signInTeacherService, signUpTeacherService } from "../../../services";
import { IMulterFiles } from "../../../interfaces";

// SignUpTeacher Handler
export const SignUpTeacher: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const parsedData = req.body;
    const { single } = req.files as IMulterFiles;

    const result = await signUpTeacherService(parsedData, single);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: staticProps.common.CREATED,
      data: result,
    });
  }
);

// SignInTeacher Handler
export const SignInTeacher: RequestHandler = catchAsync(async (req, res) => {
  const parsedData = req.body;

  const result = await signInTeacherService(parsedData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: staticProps.common.LOGGED_IN,
    data: result,
  });
});
