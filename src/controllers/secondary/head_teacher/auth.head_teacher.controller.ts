import httpStatus from "http-status";
import { Request, Response, RequestHandler } from "express";
import { catchAsync } from "../../../middlewares";
import { sendResponse, staticProps } from "../../../utils";
import { signInHeadTeacherService, signUpHeadTeacherService } from "../../../services";
import { IMulterFiles } from "../../../interfaces";

// SignUpHeadTeacher Handler
export const SignUpHeadTeacher: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const parsedData = req.body;
    const { single } = req.files as IMulterFiles;

    const result = await signUpHeadTeacherService(parsedData, single);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: staticProps.common.CREATED,
      data: result,
    });
  }
);

// SignInHeadTeacher Handler
export const SignInHeadTeacher: RequestHandler = catchAsync(async (req, res) => {
  const parsedData = req.body;

  const result = await signInHeadTeacherService(parsedData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: staticProps.common.LOGGED_IN,
    data: result,
  });
});
