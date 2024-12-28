// src/controllers/student/student.controller.ts
import httpStatus from "http-status";
import { Request, Response, RequestHandler } from "express";
import {
  ApiError,
  uploadFiles,
  validateZodSchema,
} from "../../../cores";
import { catchAsync } from "../../../middlewares";
import { parseQueryData, sendResponse, staticProps } from "../../../utils";
import {
  getAllStudentsService,
  getStudentByIdService,
  updateStudentByIdService,
  deleteStudentByIdService,
} from "../../../services";
import { StudentUpdateDtoZodSchema } from "../../../validations";
import { IMulterFiles } from "../../../interfaces";

// Get all students with pagination
export const GetAllStudents: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { page, limit } = parseQueryData(req.query);
    const { school_uid } = req.body;

    if (!school_uid) {
      throw new ApiError(httpStatus.BAD_REQUEST, "School UID is required.");
    }

    const { studentsFromDto, meta } = await getAllStudentsService(
      school_uid,
      page,
      limit
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
    const { single } = req.files as IMulterFiles;

    if (!studentId) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        staticProps.common.DATA_REQUIRED
      );
    }

    //TODO:: Check if student exists and delete the previous image if new image is uploaded
    // if (student.student_image) {
    //   removeFile(student.student_image);
    // }

    if (single) {
      const { filePath } = await uploadFiles(single);
      parsedData.student_image =
        filePath || staticProps.default.DEFAULT_IMAGE_PATH;
    }

    const validatedData = validateZodSchema(
      parsedData,
      StudentUpdateDtoZodSchema
    );

    const updatedStudent = await updateStudentByIdService(
      studentId,
      validatedData
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

    if (!studentId || !school_uid) {
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
