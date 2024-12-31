// src/controllers/headTeacher/headTeacher.controller.ts
import httpStatus from "http-status";
import { Request, Response, RequestHandler } from "express";
import { catchAsync } from "../../../middlewares";
import { parseQueryData, sendResponse, staticProps } from "../../../utils";
import {
  getAllHeadTeachersService,
  getHeadTeacherByIdService,
  updateHeadTeacherByIdService,
  deleteHeadTeacherByIdService,
} from "../../../services";
import { IMulterFiles } from "../../../interfaces";

// Get all headTeachers with pagination
export const GetAllHeadTeachers: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { page, limit } = parseQueryData(req.query);
    const { school_uid } = req.body;

    const result = await getAllHeadTeachersService(school_uid, page, limit);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: result.headTeachersFromDto,
      meta: result.meta,
    });
  }
);

// Get a headTeacher by ID
export const GetHeadTeacherById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { headTeacherId } = req.params;
    const { school_uid } = req.body;

    const result = await getHeadTeacherByIdService(school_uid, headTeacherId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: result,
    });
  }
);

// Update a headTeacher by ID
export const UpdateHeadTeacherById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const headTeacherId = req.params.headTeacherId;
    const parsedData = req.body;
    const { single } = (req.files as IMulterFiles) || {};

    const updatedHeadTeacher = await updateHeadTeacherByIdService(
      headTeacherId,
      parsedData,
      single
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.UPDATED,
      data: updatedHeadTeacher,
    });
  }
);

// Delete a headTeacher by ID
export const DeleteHeadTeacherById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const headTeacherId = req.params.headTeacherId;
    const { school_uid } = req.body;

    await deleteHeadTeacherByIdService(school_uid, headTeacherId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.DELETED,
    });
  }
);
