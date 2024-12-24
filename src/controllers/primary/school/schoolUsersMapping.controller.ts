// src/controllers/schoolUsersMapping/schoolUsersMapping.controller.ts
import httpStatus from "http-status";
import { isValidObjectId } from "mongoose";
import { Request, RequestHandler, Response } from "express";
import { SchoolUsersMapping } from "../../../models";
import {
  staticProps,
  sendResponse,
  paginate,
  parseQueryData,
} from "../../../utils";
import { ApiError } from "../../../services";
import {
  ISchoolUsersMappingAdd,
  ISchoolUsersMappingUpdate,
} from "../../../interfaces";
import { catchAsync } from "../../../middlewares";
import { SchoolUsersMappingResponseDto } from "../../../dtos/primary/school/schoolUsersMapping.dto";

// get all schoolUsersMappings with pagination
export const GetAllSchoolUsersMappings: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { page, limit } = parseQueryData(req.query);

    const paginatedResult = await paginate(SchoolUsersMapping.find(), {
      page,
      limit,
    });

    const schoolUsersMappingsFromDto = paginatedResult.data.map(
      (schoolUsersMapping) =>
        new SchoolUsersMappingResponseDto(schoolUsersMapping.toObject())
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: schoolUsersMappingsFromDto,
      meta: paginatedResult.meta,
    });
  }
);

// get one schoolUsersMapping
export const GetSchoolUsersMappingById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { schoolUsersMappingId } = req.params;

    // Validate ID format
    if (!isValidObjectId(schoolUsersMappingId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
    }

    const schoolUsersMapping = await SchoolUsersMapping.findById(
      schoolUsersMappingId
    );

    if (!schoolUsersMapping) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    const schoolUsersMappingFromDto = new SchoolUsersMappingResponseDto(
      schoolUsersMapping
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: schoolUsersMappingFromDto,
    });
  }
);

// create one schoolUsersMapping
export const AddOneSchoolUsersMapping: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    // Parsing data
    const parsedData = req.body;

    const { email, school_name, school_image, school_id, db_name } =
      parsedData as ISchoolUsersMappingAdd;

    const constructedData = {
      email,
      school_name,
      school_image,
      school_id,
      db_name,
    };

    // Create new schoolUsersMapping
    const schoolUsersMappingData = await SchoolUsersMapping.create(
      constructedData
    );

    if (!schoolUsersMappingData) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    const schoolUsersMappingFromDto = new SchoolUsersMappingResponseDto(
      schoolUsersMappingData
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: staticProps.common.CREATED,
      data: schoolUsersMappingFromDto,
    });
  }
);

// update one schoolUsersMapping
export const UpdateSchoolUsersMappingById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    // parsing data and params
    const { schoolUsersMappingId } = req.params;
    const parsedData = req.body;

    //get parsed data
    const { email, school_name, school_image, school_id, db_name } =
      parsedData as ISchoolUsersMappingUpdate;

    if (!isValidObjectId(schoolUsersMappingId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
    }

    // Check if a schoolUsersMapping exists or not
    const existsSchoolUsersMapping = await SchoolUsersMapping.findById(
      schoolUsersMappingId
    );
    if (!existsSchoolUsersMapping)
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);

    //construct data
    let constructedData = {
      email,
      school_name,
      school_image,
      school_id,
      db_name,
    };

    // updating role info
    const schoolUsersMappingData = await SchoolUsersMapping.findOneAndUpdate(
      { _id: schoolUsersMappingId },
      {
        $set: constructedData,
      },
      { new: true, runValidators: true }
    );

    //process the schoolUsersMapping data
    if (!schoolUsersMappingData) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }
    const schoolUsersMappingFromDto = new SchoolUsersMappingResponseDto(
      schoolUsersMappingData
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.UPDATED,
      data: schoolUsersMappingFromDto,
    });
  }
);

// delete one schoolUsersMapping
export const DeleteSchoolUsersMappingById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { schoolUsersMappingId } = req.params;

    if (!isValidObjectId(schoolUsersMappingId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
    }

    const result = await SchoolUsersMapping.deleteOne({
      _id: schoolUsersMappingId,
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
