import httpStatus from "http-status";
import { Request, RequestHandler, Response } from "express";
import { catchAsync } from "../../middlewares";
import {
  signUpEntityService,
  signInAdminService,
  signInEntityService,
  signUpAdminService,
} from "../../services";
import { ENUM_ADMIN_ROLES, sendResponse, staticProps } from "../../utils";
import { IMulterFiles } from "../../interfaces";

export const CentralSignup: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const parsedData = req.body;
    const { single } = req.files as IMulterFiles;
    const { entity_type } = parsedData;

    let result;

    if (
      entity_type === ENUM_ADMIN_ROLES.SUPER_ADMIN ||
      entity_type === ENUM_ADMIN_ROLES.STAFF_ADMIN
    ) {
      result = await signUpAdminService(parsedData, single);
    } else {
      result = await signUpEntityService(parsedData, single);
    }

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
    const { entity_type } = parsedData;

    let result;

    if (
      entity_type === ENUM_ADMIN_ROLES.SUPER_ADMIN ||
      entity_type === ENUM_ADMIN_ROLES.STAFF_ADMIN
    ) {
      result = await signInAdminService(parsedData);
    } else {
      result = await signInEntityService(parsedData);
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.LOGGED_IN,
      data: result,
    });
  }
);
