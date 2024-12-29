import httpStatus from "http-status";
import { Request, Response, RequestHandler } from "express";
import { catchAsync } from "../../../middlewares";
import { sendResponse, staticProps } from "../../../utils";
import { signInEntityService, signUpEntityService } from "../../../services";
import { IMulterFiles } from "../../../interfaces";

// Add or register a entity
export const SignUpEntity: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const parsedData = req.body;
    const { single } = req.files as IMulterFiles;

    const entity = await signUpEntityService(parsedData, single);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: staticProps.common.CREATED,
      data: entity,
    });
  }
);

// SignInEntity Handler
export const SignInEntity: RequestHandler = catchAsync(async (req, res) => {
  const parsedData = req.body;

  const result = await signInEntityService(parsedData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: staticProps.common.LOGGED_IN,
    data: result,
  });
});
