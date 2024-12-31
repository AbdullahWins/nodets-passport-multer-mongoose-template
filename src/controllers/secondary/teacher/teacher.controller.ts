// src/controllers/teacher/teacher.controller.ts
import httpStatus from "http-status";
import { Request, Response, RequestHandler } from "express";
import { catchAsync } from "../../../middlewares";
import { parseQueryData, sendResponse, staticProps } from "../../../utils";
import {
  getAllTeachersService,
  getTeacherByIdService,
  updateTeacherByIdService,
  deleteTeacherByIdService,
} from "../../../services";
import { IMulterFiles } from "../../../interfaces";

// Get all teachers with pagination
export const GetAllTeachers: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { page, limit } = parseQueryData(req.query);
    const { school_uid } = req.body;

    const result = await getAllTeachersService(school_uid, page, limit);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: result.teachersFromDto,
      meta: result.meta,
    });
  }
);

// Get a teacher by ID
export const GetTeacherById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { teacherId } = req.params;
    const { school_uid } = req.body;

    const result = await getTeacherByIdService(school_uid, teacherId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: result,
    });
  }
);

// Update a teacher by ID
export const UpdateTeacherById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const teacherId = req.params.teacherId;
    const parsedData = req.body;
    const { single } = (req.files as IMulterFiles) || {};

    const updatedTeacher = await updateTeacherByIdService(
      teacherId,
      parsedData,
      single
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.UPDATED,
      data: updatedTeacher,
    });
  }
);

// Delete a teacher by ID
export const DeleteTeacherById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const teacherId = req.params.teacherId;
    const { school_uid } = req.body;

    await deleteTeacherByIdService(school_uid, teacherId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.DELETED,
    });
  }
);
