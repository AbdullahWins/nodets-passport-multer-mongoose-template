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
import { ApiError, compareString, generateJwtToken, hashString } from "../../../cores";
import { IGuardian, IGuardianUpdate } from "../../../interfaces";
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

    const { school_db_name } = guardianMapping;

    // Connect to the corresponding secondary DB
    const guardianDB = await connectToSchoolDB(school_db_name);

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

// Add or register a guardian
export const SignUpGuardian: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { name, email, image, address, school_uid, password } = req.body;

    // Validate school_uid
    const school = await School.findOne({ school_uid });
    if (!school) {
      throw new ApiError(httpStatus.NOT_FOUND, "Invalid school UID.");
    }

    // Connect to the school's database
    const schoolDB = await connectToSchoolDB(school.school_db_name);
    if (!schoolDB) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        staticProps.database.CONNECTION_ERROR_SECONDARY
      );
    }

    // Hash the password (assuming bcrypt is used for hashing)
    const hashedPassword = await hashString(password);

    // Construct guardian data
    const guardianData = {
      name,
      email,
      image,
      address,
      password: hashedPassword,
    };

    // Add the guardian to the school's database
    const insertResult = await schoolDB
      .collection("guardians")
      .insertOne(guardianData);

    const guardian = await schoolDB
      .collection("guardians")
      .findOne({ _id: insertResult.insertedId });

    if (!guardian) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    const guardianFromDto = new GuardianResponseDto(guardian as IGuardian);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: staticProps.common.CREATED,
      data: guardianFromDto,
    });
  }
);

// Guardian login
export const SignInGuardian: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { email, password, school_uid } = req.body;

    // Validate school_uid
    const school = await School.findOne({ school_uid });
    if (!school) {
      throw new ApiError(httpStatus.NOT_FOUND, "Invalid school UID.");
    }

    // Connect to the school's database
    const schoolDB = await connectToSchoolDB(school.school_db_name);
    if (!schoolDB) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        staticProps.database.CONNECTION_ERROR_SECONDARY
      );
    }

    // Find guardian by email
    const guardian = await schoolDB.collection("guardians").findOne({ email });
    if (!guardian) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials.");
    }

    // Compare the password
    const isPasswordMatch = await compareString(password, guardian.password);
    if (!isPasswordMatch) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials.");
    }

    // Generate a JWT token (assuming JWT is used)
    const jwtPayload = {
      _id: guardian._id,
      email: guardian.email,
      role: guardian.role,
    };
    const token = generateJwtToken(jwtPayload);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Login successful.",
      data: { token, guardian: new GuardianResponseDto(guardian as IGuardian) },
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
