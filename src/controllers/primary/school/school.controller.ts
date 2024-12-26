// src/controllers/school/school.controller.ts
import httpStatus from "http-status";
import { isValidObjectId } from "mongoose";
import { Request, RequestHandler, Response } from "express";
import {
  staticProps,
  sendResponse,
  paginate,
  parseQueryData,
} from "../../../utils";
import { ApiError } from "../../../cores";
import { ISchoolAdd, ISchoolUpdate } from "../../../interfaces";
import { catchAsync } from "../../../middlewares";
import { SchoolResponseDto } from "../../../dtos";
import { School } from "../../../models";
import { connectToSchoolDB } from "../../../configs";

// get all schools with pagination
export const GetAllSchools: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { page, limit } = parseQueryData(req.query);

    const paginatedResult = await paginate(School.find(), {
      page,
      limit,
    });

    const schoolsFromDto = paginatedResult.data.map(
      (school) => new SchoolResponseDto(school.toObject())
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: schoolsFromDto,
      meta: paginatedResult.meta,
    });
  }
);

// get one school
export const GetSchoolById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { schoolId } = req.params;

    // Validate ID format
    if (!isValidObjectId(schoolId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
    }

    const school = await School.findById(schoolId);

    if (!school) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    const schoolFromDto = new SchoolResponseDto(school);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: schoolFromDto,
    });
  }
);

// add one school
export const AddOneSchool: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    // Parsing data from the request
    const parsedData = req.body;

    const {
      school_email,
      school_name,
      school_address,
      school_image,
      school_uid,
    } = parsedData as ISchoolAdd;

    // Construct the new school data
    const school_db_name = `school_${school_uid.toLowerCase()}`;
    const constructedData = {
      school_email,
      school_name,
      school_address,
      school_image,
      school_uid,
      school_db_name,
    };

    // Step 1: Insert the school data into the main database
    const schoolData = await School.create(constructedData);

    if (!schoolData) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.NOT_FOUND);
    }

    // Step 2: Create a connection to the new database
    const schoolDB = await connectToSchoolDB(school_db_name);

    if (!schoolDB) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        staticProps.database.CONNECTION_ERROR_SECONDARY
      );
    }

    // Optional: Add some initial setup to the new database if required
    await schoolDB.collection("metadata").insertOne({
      created_at: new Date(),
      school_name,
      school_uid,
    });

    // Step 3: Return the school information in the response
    const schoolFromDto = new SchoolResponseDto(schoolData);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: staticProps.common.CREATED,
      data: schoolFromDto,
    });
  }
);

// update one school
export const UpdateSchoolById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    // parsing data and params
    const { schoolId } = req.params;
    const parsedData = req.body;

    //get parsed data
    const {
      school_email,
      school_name,
      school_address,
      school_image,
      school_uid,
      school_db_name,
    } = parsedData as ISchoolUpdate;

    if (!isValidObjectId(schoolId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
    }

    // Check if a school exists or not
    const existsSchool = await School.findById(schoolId);
    if (!existsSchool)
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);

    //construct data
    let constructedData = {
      school_email,
      school_name,
      school_address,
      school_image,
      school_uid,
      school_db_name,
    };

    // updating role info
    const schoolData = await School.findOneAndUpdate(
      { _id: schoolId },
      {
        $set: constructedData,
      },
      { new: true, runValidators: true }
    );

    //process the school data
    if (!schoolData) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }
    const schoolFromDto = new SchoolResponseDto(schoolData);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.UPDATED,
      data: schoolFromDto,
    });
  }
);

// delete one school
export const DeleteSchoolById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { schoolId } = req.params;

    if (!isValidObjectId(schoolId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
    }

    const result = await School.deleteOne({
      _id: schoolId,
    });

    if (result.deletedCount === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.DELETED,
    });
  }
);
