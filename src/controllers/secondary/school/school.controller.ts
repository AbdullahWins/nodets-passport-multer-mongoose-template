// src/controllers/school/school.controller.ts
import httpStatus from "http-status";
import { isValidObjectId } from "mongoose";
import { Request, RequestHandler, Response } from "express";
import { School, SchoolUsersMapping } from "../../../models";
import {
  staticProps,
  sendResponse,
  paginate,
  parseQueryData,
} from "../../../utils";
import { ApiError } from "../../../services";
import { ISchool, ISchoolAdd, ISchoolUpdate } from "../../../interfaces";
import mongoose from "mongoose";
import { catchAsync } from "../../../middlewares";
// import {
import { SchoolResponseDto } from "../../../dtos";
import { connectToSchoolDB } from "../../../configs";

// get all schools with pagination
export const GetAllSchools: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { page, limit } = parseQueryData(req.query);

    const paginatedResult = await paginate(School.find(), { page, limit });

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

export const GetSchoolById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { schoolId } = req.params;

    // Validate ID format
    if (!isValidObjectId(schoolId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
    }

    // Fetch db_name from the primary DB
    const schoolMapping = await SchoolUsersMapping.findOne({ schoolId }).lean();
    if (!schoolMapping) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    const { db_name } = schoolMapping;

    // Connect to the corresponding secondary DB
    const schoolDB = await connectToSchoolDB(db_name);

    // Fetch school data from the secondary DB
    if (!schoolDB) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        staticProps.database.CONNECTION_ERROR_SECONDARY
      );
    }
    const school = await schoolDB
      .collection("schools")
      .findOne({ _id: new mongoose.Types.ObjectId(schoolId) });

    if (!school) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    const schoolFromDto = new SchoolResponseDto(school as ISchool);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: schoolFromDto,
    });
  }
);

// get one school
// export const GetSchoolById: RequestHandler = catchAsync(
//   async (req: Request, res: Response) => {
//     const { schoolId } = req.params;

//     // Validate ID format
//     if (!isValidObjectId(schoolId)) {
//       throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
//     }

//     const school = await School.findById(schoolId);

//     if (!school) {
//       throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
//     }

//     const schoolFromDto = new SchoolResponseDto(school);

//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       message: staticProps.common.RETRIEVED,
//       data: schoolFromDto,
//     });
//   }
// );

// create one school
// export const AddOneSchool: RequestHandler = catchAsync(
//   async (req: Request, res: Response) => {
//     // Parsing data
//     const parsedData = req.body;
//     const { name, image, address } = parsedData as ISchoolAdd;

//     // validate data with zod schema
//     // validateZodSchema(SchoolAddDtoZodSchema, parsedData);

//     const constructedData = {
//       name,
//       image,
//       address,
//     };

//     // Create new school
//     const schoolData = await School.create(constructedData);

//     if (!schoolData) {
//       throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
//     }

//     const schoolFromDto = new SchoolResponseDto(schoolData);

//     sendResponse(res, {
//       statusCode: httpStatus.CREATED,
//       message: staticProps.common.CREATED,
//       data: schoolFromDto,
//     });
//   }
// );

export const AddOneSchool: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { name, image, address } = req.body as ISchoolAdd;

    // Create a unique `db_name` for the new school
    const dbName = `school_${name.toLowerCase().replace(/\s+/g, "_")}`;

    // Add school entry to the primary DB (mapping)
    await SchoolUsersMapping.create({
      schoolId: new mongoose.Types.ObjectId(),
      email: "abc@gmail.com",
      school_id: new mongoose.Types.ObjectId(),
      school_image: image,
      school_name: name,
      db_name: dbName,
      name,
    });

    // Connect to the secondary DB for this school
    const schoolDB = await connectToSchoolDB(dbName);

    console.log("schoolDB", schoolDB);

    // Add school data to the secondary DB
    const constructedData = { name, image, address };
    if (!schoolDB) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        staticProps.database.CONNECTION_ERROR_SECONDARY
      );
    }

    console.log("constructedData", constructedData);

    const insertResult = await schoolDB
      .collection("schools")
      .insertOne(constructedData);

    console.log("insertResult", insertResult);

    const school = await schoolDB
      .collection("schools")
      .findOne({ _id: insertResult.insertedId });

    if (!school) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    const schoolFromDto = new SchoolResponseDto(school as ISchool);

    console.log("schoolFromDto", schoolFromDto);

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
    const schoolId = req.params.schoolId;
    const parsedData = req.body;

    //get parsed data
    const { name, image, address } = parsedData as ISchoolUpdate;

    if (!isValidObjectId(schoolId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
    }

    // validate data with zod schema
    // validateZodSchema(SchoolUpdateDtoZodSchema, parsedData);

    // Check if a school exists or not
    const existsSchool = await School.findById(schoolId);
    if (!existsSchool) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.NOT_FOUND);
    }

    //construct data
    let constructedData = {
      name,
      image,
      address,
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
    const schoolId = req.params.schoolId;

    if (!isValidObjectId(schoolId))
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);

    const result = await School.deleteOne({ _id: schoolId });

    if (result.deletedCount === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.DELETED,
    });
  }
);
