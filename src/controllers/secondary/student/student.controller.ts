// src/controllers/student/student.controller.ts
import httpStatus from "http-status";
import { isValidObjectId } from "mongoose";
import { Request, RequestHandler, Response } from "express";
import { Student, School } from "../../../models";
import {
  staticProps,
  sendResponse,
  paginate,
  parseQueryData,
} from "../../../utils";
import { ApiError } from "../../../cores";
import { IStudent, IStudentUpdate } from "../../../interfaces";
import mongoose from "mongoose";
import { catchAsync } from "../../../middlewares";
// import {
import { StudentResponseDto } from "../../../dtos";
import { connectToSchoolDB } from "../../../configs";

// get all students with pagination
export const GetAllStudents: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { page, limit } = parseQueryData(req.query);

    const paginatedResult = await paginate(Student.find(), { page, limit });

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

    // Validate ID format
    if (!isValidObjectId(studentId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
    }

    // Fetch db_name from the primary DB
    const studentMapping = await School.findOne({
      studentId,
    }).lean();
    if (!studentMapping) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    const { school_db_name } = studentMapping;

    // Connect to the corresponding secondary DB
    const studentDB = await connectToSchoolDB(school_db_name);

    // Fetch student data from the secondary DB
    if (!studentDB) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        staticProps.database.CONNECTION_ERROR_SECONDARY
      );
    }
    const student = await studentDB
      .collection("students")
      .findOne({ _id: new mongoose.Types.ObjectId(studentId) });

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
    const { name, image, address } = parsedData as IStudentUpdate;

    if (!isValidObjectId(studentId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
    }

    // validate data with zod schema
    // validateZodSchema(StudentUpdateDtoZodSchema, parsedData);

    // Check if a student exists or not
    const existsStudent = await Student.findById(studentId);
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
    const studentData = await Student.findOneAndUpdate(
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

    if (!isValidObjectId(studentId))
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);

    const result = await Student.deleteOne({ _id: studentId });

    if (result.deletedCount === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.DELETED,
    });
  }
);