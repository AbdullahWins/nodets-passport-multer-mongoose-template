// src/controllers/admin/admin.controller.ts
import httpStatus from "http-status";
import { Request, Response, RequestHandler } from "express";
import { catchAsync } from "../../../middlewares";
import { parseQueryData, sendResponse, staticProps } from "../../../utils";
import {
  getAllAdminsService,
  getAdminByIdService,
  updateAdminByIdService,
  deleteAdminByIdService,
} from "../../../services";
import { IMulterFiles } from "../../../interfaces";

// Get all admins with pagination
export const GetAllAdmins: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { page, limit } = parseQueryData(req.query);

    const result = await getAllAdminsService( page, limit);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: result.adminsFromDto,
      meta: result.meta,
    });
  }
);

// Get a admin by ID
export const GetAdminById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { adminId } = req.params;

    const result = await getAdminByIdService(adminId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: result,
    });
  }
);

// Update a admin by ID
export const UpdateAdminById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const adminId = req.params.adminId;
    const parsedData = req.body;
    const { single } = (req.files as IMulterFiles) || {};

    const updatedAdmin = await updateAdminByIdService(
      adminId,
      parsedData,
      single
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.UPDATED,
      data: updatedAdmin,
    });
  }
);

// Delete a admin by ID
export const DeleteAdminById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const adminId = req.params.adminId;

    await deleteAdminByIdService(adminId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.DELETED,
    });
  }
);
