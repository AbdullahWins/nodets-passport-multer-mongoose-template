import httpStatus from "http-status";
import { Request, Response, RequestHandler } from "express";
import { catchAsync } from "../../../middlewares";
import { sendResponse, staticProps } from "../../../utils";
import { signInSchoolAdminService, signUpSchoolAdminService } from "../../../services";

// SignUpSchoolAdmin Handler
export const SignUpSchoolAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const parsedData = req.body;

    const result = await signUpSchoolAdminService(parsedData);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: staticProps.common.CREATED,
      data: result,
    });
  }
);

// SignInSchoolAdmin Handler
export const SignInSchoolAdmin: RequestHandler = catchAsync(async (req, res) => {
  const parsedData = req.body;

  const result = await signInSchoolAdminService(parsedData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: staticProps.common.LOGGED_IN,
    data: result,
  });
});
