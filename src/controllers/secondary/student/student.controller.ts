// src/controllers/student/student.controller.ts
import httpStatus from "http-status";
import { isValidObjectId } from "mongoose";
import { Request, RequestHandler, Response } from "express";
import { STUDENT_MODEL_NAME, StudentSchema } from "../../../models";
import { ApiError, getSchoolModel } from "../../../cores";
import { IStudent, IStudentUpdate } from "../../../interfaces";
import { catchAsync } from "../../../middlewares";
import { StudentResponseDto } from "../../../dtos";
import {
  staticProps,
  sendResponse,
  paginate,
  parseQueryData,
} from "../../../utils";

// get all students with pagination
export const GetAllStudents: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { page, limit } = parseQueryData(req.query);
    const { school_uid } = req.body;

    const StudentModel = await getSchoolModel<IStudent>(
      school_uid,
      STUDENT_MODEL_NAME,
      StudentSchema
    );

    const paginatedResult = await paginate(StudentModel.find(), {
      page,
      limit,
    });

    const studentsFromDto = paginatedResult.data.map(
      (student) => new StudentResponseDto(student.toObject())
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: studentsFromDto,
      meta: paginatedResult.meta,
    });
  }
);

export const GetStudentById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { studentId } = req.params;
    const { school_uid } = req.body;

    // Validate ID format
    if (!isValidObjectId(studentId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
    }

    const StudentModel = await getSchoolModel<IStudent>(
      school_uid,
      STUDENT_MODEL_NAME,
      StudentSchema
    );

    const student = await StudentModel.findById(studentId);
    if (!student) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    const studentFromDto = new StudentResponseDto(student as IStudent);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: studentFromDto,
    });
  }
);

// update one student
export const UpdateStudentById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    // parsing data and params
    const studentId = req.params.studentId;
    const parsedData = req.body;

    //get parsed data
    const { name, image, address, school_uid } = parsedData as IStudentUpdate;

    if (!isValidObjectId(studentId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
    }

    // validate data with zod schema
    // validateZodSchema(StudentUpdateDtoZodSchema, parsedData);

    const StudentModel = await getSchoolModel<IStudent>(
      school_uid,
      STUDENT_MODEL_NAME,
      StudentSchema
    );

    // Check if a student exists or not
    const existsStudent = await StudentModel.findById(studentId);
    if (!existsStudent) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.NOT_FOUND);
    }

    //construct data
    let constructedData = {
      name,
      image,
      address,
    };

    // updating role info
    const studentData = await StudentModel.findOneAndUpdate(
      { _id: studentId },
      {
        $set: constructedData,
      },
      { new: true, runValidators: true }
    );

    //process the student data
    if (!studentData) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }
    const studentFromDto = new StudentResponseDto(studentData);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.UPDATED,
      data: studentFromDto,
    });
  }
);

// delete one student
export const DeleteStudentById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const studentId = req.params.studentId;
    const { school_uid } = req.body;

    if (!isValidObjectId(studentId))
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);

    const StudentModel = await getSchoolModel<IStudent>(
      school_uid,
      STUDENT_MODEL_NAME,
      StudentSchema
    );

    const result = await StudentModel.deleteOne({ _id: studentId });

    if (result.deletedCount === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.DELETED,
    });
  }
);
