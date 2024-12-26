// src/controllers/teacher/teacher.controller.ts
import httpStatus from "http-status";
import { isValidObjectId } from "mongoose";
import { Request, RequestHandler, Response } from "express";
import { Teacher, School } from "../../../models";
import {
  staticProps,
  sendResponse,
  paginate,
  parseQueryData,
} from "../../../utils";
import { ApiError } from "../../../cores";
import { ITeacher, ITeacherUpdate } from "../../../interfaces";
import mongoose from "mongoose";
import { catchAsync } from "../../../middlewares";
// import {
import { TeacherResponseDto } from "../../../dtos";
import { connectToSchoolDB } from "../../../configs";

// get all teachers with pagination
export const GetAllTeachers: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { page, limit } = parseQueryData(req.query);

    const paginatedResult = await paginate(Teacher.find(), { page, limit });

    const teachersFromDto = paginatedResult.data.map(
      (teacher) => new TeacherResponseDto(teacher.toObject())
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: teachersFromDto,
      meta: paginatedResult.meta,
    });
  }
);

export const GetTeacherById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { teacherId } = req.params;

    // Validate ID format
    if (!isValidObjectId(teacherId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
    }

    // Fetch db_name from the primary DB
    const teacherMapping = await School.findOne({
      teacherId,
    }).lean();
    if (!teacherMapping) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    const { school_db_name } = teacherMapping;

    // Connect to the corresponding secondary DB
    const teacherDB = await connectToSchoolDB(school_db_name);

    // Fetch teacher data from the secondary DB
    if (!teacherDB) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        staticProps.database.CONNECTION_ERROR_SECONDARY
      );
    }
    const teacher = await teacherDB
      .collection("teachers")
      .findOne({ _id: new mongoose.Types.ObjectId(teacherId) });

    if (!teacher) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    const teacherFromDto = new TeacherResponseDto(teacher as ITeacher);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: teacherFromDto,
    });
  }
);

// update one teacher
export const UpdateTeacherById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    // parsing data and params
    const teacherId = req.params.teacherId;
    const parsedData = req.body;

    //get parsed data
    const { name, image, address } = parsedData as ITeacherUpdate;

    if (!isValidObjectId(teacherId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
    }

    // validate data with zod schema
    // validateZodSchema(TeacherUpdateDtoZodSchema, parsedData);

    // Check if a teacher exists or not
    const existsTeacher = await Teacher.findById(teacherId);
    if (!existsTeacher) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.NOT_FOUND);
    }

    //construct data
    let constructedData = {
      name,
      image,
      address,
    };

    // updating role info
    const teacherData = await Teacher.findOneAndUpdate(
      { _id: teacherId },
      {
        $set: constructedData,
      },
      { new: true, runValidators: true }
    );

    //process the teacher data
    if (!teacherData) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }
    const teacherFromDto = new TeacherResponseDto(teacherData);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.UPDATED,
      data: teacherFromDto,
    });
  }
);

// delete one teacher
export const DeleteTeacherById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const teacherId = req.params.teacherId;

    if (!isValidObjectId(teacherId))
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);

    const result = await Teacher.deleteOne({ _id: teacherId });

    if (result.deletedCount === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.DELETED,
    });
  }
);
