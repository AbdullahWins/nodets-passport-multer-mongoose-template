// src/controllers/guardian/guardian.controller.ts
import httpStatus from "http-status";
import { isValidObjectId } from "mongoose";
import { Request, RequestHandler, Response } from "express";
import { Guardian, School } from "../../../models";
import {
  staticProps,
  sendResponse,
  paginate,
  parseQueryData,
} from "../../../utils";
import { ApiError } from "../../../services";
import { IGuardian, IGuardianAdd, IGuardianUpdate } from "../../../interfaces";
import mongoose from "mongoose";
import { catchAsync } from "../../../middlewares";
// import {
import { GuardianResponseDto } from "../../../dtos";
import { connectToSchoolDB } from "../../../configs";

// get all guardians with pagination
export const GetAllGuardians: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { page, limit } = parseQueryData(req.query);

    const paginatedResult = await paginate(Guardian.find(), { page, limit });

    const guardiansFromDto = paginatedResult.data.map(
      (guardian) => new GuardianResponseDto(guardian.toObject())
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: guardiansFromDto,
      meta: paginatedResult.meta,
    });
  }
);

export const GetGuardianById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { guardianId } = req.params;

    // Validate ID format
    if (!isValidObjectId(guardianId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
    }

    // Fetch db_name from the primary DB
    const guardianMapping = await School.findOne({
      guardianId,
    }).lean();
    if (!guardianMapping) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    const { db_name } = guardianMapping;

    // Connect to the corresponding secondary DB
    const guardianDB = await connectToSchoolDB(db_name);

    // Fetch guardian data from the secondary DB
    if (!guardianDB) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        staticProps.database.CONNECTION_ERROR_SECONDARY
      );
    }
    const guardian = await guardianDB
      .collection("guardians")
      .findOne({ _id: new mongoose.Types.ObjectId(guardianId) });

    if (!guardian) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    const guardianFromDto = new GuardianResponseDto(guardian as IGuardian);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: guardianFromDto,
    });
  }
);

// get one guardian
// export const GetGuardianById: RequestHandler = catchAsync(
//   async (req: Request, res: Response) => {
//     const { guardianId } = req.params;

//     // Validate ID format
//     if (!isValidObjectId(guardianId)) {
//       throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
//     }

//     const guardian = await Guardian.findById(guardianId);

//     if (!guardian) {
//       throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
//     }

//     const guardianFromDto = new GuardianResponseDto(guardian);

//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       message: staticProps.common.RETRIEVED,
//       data: guardianFromDto,
//     });
//   }
// );

// create one guardian
// export const AddOneGuardian: RequestHandler = catchAsync(
//   async (req: Request, res: Response) => {
//     // Parsing data
//     const parsedData = req.body;
//     const { name, image, address } = parsedData as IGuardianAdd;

//     // validate data with zod schema
//     // validateZodSchema(GuardianAddDtoZodSchema, parsedData);

//     const constructedData = {
//       name,
//       image,
//       address,
//     };

//     // Create new guardian
//     const guardianData = await Guardian.create(constructedData);

//     if (!guardianData) {
//       throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
//     }

//     const guardianFromDto = new GuardianResponseDto(guardianData);

//     sendResponse(res, {
//       statusCode: httpStatus.CREATED,
//       message: staticProps.common.CREATED,
//       data: guardianFromDto,
//     });
//   }
// );

export const AddOneGuardian: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { name, image, address } = req.body as IGuardianAdd;

    // Create a unique `db_name` for the new guardian
    const dbName = `guardian_${name.toLowerCase().replace(/\s+/g, "_")}`;

    // Add guardian entry to the primary DB (mapping)
    await School.create({
      guardianId: new mongoose.Types.ObjectId(),
      email: "abc@gmail.com",
      guardian_id: new mongoose.Types.ObjectId(),
      guardian_image: image,
      guardian_name: name,
      db_name: dbName,
      name,
    });

    // Connect to the secondary DB for this guardian
    const guardianDB = await connectToSchoolDB(dbName);

    console.log("guardianDB", guardianDB);

    // Add guardian data to the secondary DB
    const constructedData = { name, image, address };
    if (!guardianDB) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        staticProps.database.CONNECTION_ERROR_SECONDARY
      );
    }

    console.log("constructedData", constructedData);

    const insertResult = await guardianDB
      .collection("guardians")
      .insertOne(constructedData);

    console.log("insertResult", insertResult);

    const guardian = await guardianDB
      .collection("guardians")
      .findOne({ _id: insertResult.insertedId });

    if (!guardian) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    const guardianFromDto = new GuardianResponseDto(guardian as IGuardian);

    console.log("guardianFromDto", guardianFromDto);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: staticProps.common.CREATED,
      data: guardianFromDto,
    });
  }
);

// update one guardian
export const UpdateGuardianById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    // parsing data and params
    const guardianId = req.params.guardianId;
    const parsedData = req.body;

    //get parsed data
    const { name, image, address } = parsedData as IGuardianUpdate;

    if (!isValidObjectId(guardianId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
    }

    // validate data with zod schema
    // validateZodSchema(GuardianUpdateDtoZodSchema, parsedData);

    // Check if a guardian exists or not
    const existsGuardian = await Guardian.findById(guardianId);
    if (!existsGuardian) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.NOT_FOUND);
    }

    //construct data
    let constructedData = {
      name,
      image,
      address,
    };

    // updating role info
    const guardianData = await Guardian.findOneAndUpdate(
      { _id: guardianId },
      {
        $set: constructedData,
      },
      { new: true, runValidators: true }
    );

    //process the guardian data
    if (!guardianData) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }
    const guardianFromDto = new GuardianResponseDto(guardianData);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.UPDATED,
      data: guardianFromDto,
    });
  }
);

// delete one guardian
export const DeleteGuardianById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const guardianId = req.params.guardianId;

    if (!isValidObjectId(guardianId))
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);

    const result = await Guardian.deleteOne({ _id: guardianId });

    if (result.deletedCount === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.DELETED,
    });
  }
);
