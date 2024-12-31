// src/controllers/schoolAdmin/schoolAdmin.controller.ts
import httpStatus from "http-status";
import { Request, Response, RequestHandler } from "express";
import { catchAsync } from "../../../middlewares";
import { parseQueryData, sendResponse, staticProps } from "../../../utils";
import {
  getAllSchoolAdminsService,
  getSchoolAdminByIdService,
  updateSchoolAdminByIdService,
  deleteSchoolAdminByIdService,
} from "../../../services";

// Get all schoolAdmins with pagination
export const GetAllSchoolAdmins: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { page, limit } = parseQueryData(req.query);
    const { school_uid } = req.body;

    const result = await getAllSchoolAdminsService(school_uid, page, limit);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: result.schoolAdminsFromDto,
      meta: result.meta,
    });
  }
);

// Get a schoolAdmin by ID
export const GetSchoolAdminById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { schoolAdminId } = req.params;
    const { school_uid } = req.body;

    const result = await getSchoolAdminByIdService(school_uid, schoolAdminId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: result,
    });
  }
);

// Update a schoolAdmin by ID
export const UpdateSchoolAdminById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const schoolAdminId = req.params.schoolAdminId;
    const parsedData = req.body;

    const updatedSchoolAdmin = await updateSchoolAdminByIdService(
      schoolAdminId,
      parsedData
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.UPDATED,
      data: updatedSchoolAdmin,
    });
  }
);

// Delete a schoolAdmin by ID
export const DeleteSchoolAdminById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const schoolAdminId = req.params.schoolAdminId;
    const { school_uid } = req.body;

    await deleteSchoolAdminByIdService(school_uid, schoolAdminId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.DELETED,
    });
  }
);
