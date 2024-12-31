import httpStatus from "http-status";
import { Request, RequestHandler, Response } from "express";
import { catchAsync } from "../../middlewares";
import {
  signUpEntityService,
  signInAdminService,
  signInEntityService,
  signUpAdminService,
} from "../../services";
import { sendResponse, staticProps } from "../../utils";
import { IMulterFiles } from "../../interfaces";

export const CentralSignin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const parsedData = req.body;

    let result;

    if (parsedData.school_uid === staticProps.default.DEFAULT_SUPER_ADMIN) {
      console.log("1");
      result = await signInAdminService(parsedData);
    } else {
      console.log("2");
      result = await signInEntityService(parsedData);
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.LOGGED_IN,
      data: result,
    });
  }
);

export const CentralSignup: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const parsedData = req.body;
    const { single } = req.files as IMulterFiles;

    let result;

    if (parsedData.school_uid === staticProps.default.DEFAULT_SUPER_ADMIN) {
      result = await signUpAdminService(parsedData, single);
    } else {
      result = await signUpEntityService(parsedData, single);
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.LOGGED_IN,
      data: result,
    });
  }
);
