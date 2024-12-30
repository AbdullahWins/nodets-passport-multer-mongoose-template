// src/controllers/student/student.controller.ts
import httpStatus from "http-status";
import { Request, Response, RequestHandler } from "express";
import { catchAsync } from "../../../middlewares";
import { parseQueryData, sendResponse, staticProps } from "../../../utils";
import {
  getAllStudentsService,
  getStudentByIdService,
  updateStudentByIdService,
  deleteStudentByIdService,
} from "../../../services";
import { IMulterFiles } from "../../../interfaces";

// Get all students with pagination
export const GetAllStudents: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { page, limit } = parseQueryData(req.query);
    const { school_uid } = req.body;

    const result = await getAllStudentsService(school_uid, page, limit);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: result.studentsFromDto,
      meta: result.meta,
    });
  }
);

// Get a student by ID
export const GetStudentById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { studentId } = req.params;
    const { school_uid } = req.body;

    const result = await getStudentByIdService(school_uid, studentId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: result,
    });
  }
);

// Update a student by ID
export const UpdateStudentById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const studentId = req.params.studentId;
    const parsedData = req.body;
    const { single } = (req.files as IMulterFiles) || {};

    const updatedStudent = await updateStudentByIdService(
      studentId,
      parsedData,
      single
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.UPDATED,
      data: updatedStudent,
    });
  }
);

// Delete a student by ID
export const DeleteStudentById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const studentId = req.params.studentId;
    const { school_uid } = req.body;

    await deleteStudentByIdService(school_uid, studentId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.DELETED,
    });
  }
);
