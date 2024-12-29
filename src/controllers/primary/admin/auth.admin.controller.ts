import httpStatus from "http-status";
import { Request, Response, RequestHandler } from "express";
import { catchAsync } from "../../../middlewares";
import { sendResponse, staticProps } from "../../../utils";
import { IMulterFiles } from "../../../interfaces";
import { signInAdminService, signUpAdminService } from "../../../services";

// Add or register a admin
export const SignUpAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const parsedData = req.body;
    const { single } = req.files as IMulterFiles;

    const admin = await signUpAdminService(parsedData, single);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: staticProps.common.CREATED,
      data: admin,
    });
  }
);

// SignInAdmin Handler
export const SignInAdmin: RequestHandler = catchAsync(async (req, res) => {
  const parsedData = req.body;

  const result = await signInAdminService(parsedData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: staticProps.common.LOGGED_IN,
    data: result,
  });
});
