// src/controllers/student/student.controller.ts
import httpStatus from "http-status";
import { Request, Response, RequestHandler } from "express";
import { ApiError } from "../../../cores";
import { catchAsync } from "../../../middlewares";
import { sendResponse, staticProps } from "../../../utils";
import {
  getAllStudentsService,
  getStudentByIdService,
  updateStudentByIdService,
  deleteStudentByIdService,
} from "../../../services";

// Get all students with pagination
export const GetAllStudents: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { page, limit } = req.query;
    const { school_uid } = req.body;

    if (!school_uid) {
      throw new ApiError(httpStatus.BAD_REQUEST, "School UID is required.");
    }

    const { studentsFromDto, meta } = await getAllStudentsService(
      school_uid,
      Number(page),
      Number(limit)
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: studentsFromDto,
      meta,
    });
  }
);

// Get a student by ID
export const GetStudentById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { studentId } = req.params;
    const { school_uid } = req.body;

    if (!studentId || !school_uid) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        staticProps.common.DATA_REQUIRED
      );
    }

    const studentFromDto = await getStudentByIdService(school_uid, studentId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: studentFromDto,
    });
  }
);

// Update a student by ID
export const UpdateStudentById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const studentId = req.params.studentId;
    const parsedData = req.body;

    if (!studentId) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        staticProps.common.DATA_REQUIRED
      );
    }

    const updatedStudent = await updateStudentByIdService(
      parsedData.school_uid,
      studentId,
      parsedData
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

    if (!studentId) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        staticProps.common.DATA_REQUIRED
      );
    }

    await deleteStudentByIdService(school_uid, studentId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.DELETED,
    });
  }
);
