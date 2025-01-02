import httpStatus from "http-status";
import { Request, RequestHandler, Response } from "express";
import { catchAsync } from "../../middlewares";
import {
  signUpEntityService,
  signInEntityService,
} from "../../services";
import { sendResponse, staticProps } from "../../utils";
import { IMulterFiles } from "../../interfaces";

export const CentralSignup: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const parsedData = req.body;
    const { single } = req.files as IMulterFiles;

    const result = await signUpEntityService(parsedData, single);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: staticProps.common.CREATED,
      data: result,
    });
  }
);

export const CentralSignin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const parsedData = req.body;

    const result = await signInEntityService(parsedData);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.LOGGED_IN,
      data: result,
    });
  }
);
