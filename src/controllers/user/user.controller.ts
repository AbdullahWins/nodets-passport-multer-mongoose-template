// src/controllers/user/user.controller.ts
import httpStatus from "http-status";
import { isValidObjectId } from "mongoose";
import { Request, RequestHandler, Response } from "express";
import { User } from "../../models";
import { ApiError, hashString, removeFile, uploadFiles } from "../../services";
import {
  staticProps,
  sendResponse,
  parseQueryData,
  paginate,
  isEntityAllowed,
} from "../../utils";
import { IJwtPayload, IMulterFiles } from "../../interfaces";
import { UserResponseDto } from "../../dtos";
import { catchAsync } from "../../middlewares";

// get all users
export const GetAllUsers: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { page, limit } = parseQueryData(req.query);

    const paginatedResult = await paginate(User.find(), { page, limit });

    const usersFromDto = paginatedResult.data.map(
      (user) => new UserResponseDto(user.toObject())
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: usersFromDto,
      meta: paginatedResult.meta,
    });
  }
);

// get one user
export const GetUserById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    const entity = req.user as IJwtPayload;

    // Validate ID format
    if (!isValidObjectId(userId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
    }

    if (!userId) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
    }

    // check the entity role
    const isAllowed = isEntityAllowed(entity.role, entity._id, userId);
    if (!isAllowed) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        staticProps.common.UNAUTHORIZED
      );
    }

    const user = await User.findById(userId).lean();

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    const userFromDto = new UserResponseDto(user);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: userFromDto,
    });
  }
);

// update one user
export const UpdateUserById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    // parsing data and params
    const { userId } = req.params;
    const parsedData = req.body;
    const { single } = req.files as IMulterFiles;
    const entity = req.user as IJwtPayload;

    if (!userId || !parsedData)
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        staticProps.common.MISSING_REQUIRED_FIELDS
      );

    // check the entity role
    const isAllowed = isEntityAllowed(entity.role, entity._id, userId);
    if (!isAllowed) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        staticProps.common.UNAUTHORIZED
      );
    }

    //get parsed data
    const { password, ...body } = parsedData;

    // Check if a user exists or not
    const existsUser = await User.findById(userId);
    if (!existsUser)
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.NOT_FOUND);

    //construct data
    let constructedData = {
      ...body,
    };

    // hash password
    if (password) {
      const hashedPassword = await hashString(password);
      constructedData = {
        ...constructedData,
        password: hashedPassword,
      };
    }

    //upload file
    if (single) {
      const { filePath } = await uploadFiles(single);
      constructedData = {
        ...constructedData,
        image: filePath || staticProps.default.DEFAULT_IMAGE_PATH,
      };

      //remove old image
      if (existsUser.image) {
        await removeFile(existsUser.image);
      }
    }

    // updating role info
    const data = await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: constructedData,
      },
      { new: true, runValidators: true }
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.UPDATED,
      data,
    });
  }
);

// delete one user
export const DeleteUserById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    const entity = req.user as IJwtPayload;

    if (!isValidObjectId(userId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
    }

    if (!userId) {
      throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.INVALID_ID);
    }

    // check the entity role
    const isAllowed = isEntityAllowed(entity.role, entity._id, userId);
    if (!isAllowed) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        staticProps.common.UNAUTHORIZED
      );
    }

    const result = await User.deleteOne({ _id: userId });

    if (result.deletedCount === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.DELETED,
    });
  }
);
