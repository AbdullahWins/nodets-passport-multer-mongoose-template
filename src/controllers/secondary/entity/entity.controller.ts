// src/controllers/entity/entity.controller.ts
import httpStatus from "http-status";
import { Request, Response, RequestHandler } from "express";
import { ApiError, uploadFiles, validateZodSchema } from "../../../cores";
import { catchAsync } from "../../../middlewares";
import { parseQueryData, sendResponse, staticProps } from "../../../utils";
import {
  getAllEntitysService,
  getEntityByIdService,
  updateEntityByIdService,
  deleteEntityByIdService,
} from "../../../services";
import { EntityUpdateDtoZodSchema } from "../../../validations";
import { IMulterFiles } from "../../../interfaces";

// Get all entitys with pagination
export const GetAllEntitys: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { page, limit } = parseQueryData(req.query);
    const { school_uid } = req.body;

    if (!school_uid) {
      throw new ApiError(httpStatus.BAD_REQUEST, "School UID is required.");
    }

    const { entitysFromDto, meta } = await getAllEntitysService(
      school_uid,
      page,
      limit
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: entitysFromDto,
      meta,
    });
  }
);

// Get a entity by ID
export const GetEntityById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { entityId } = req.params;
    const { school_uid } = req.body;

    if (!entityId || !school_uid) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        staticProps.common.DATA_REQUIRED
      );
    }

    const entityFromDto = await getEntityByIdService(school_uid, entityId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: entityFromDto,
    });
  }
);

// Update a entity by ID
export const UpdateEntityById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const entityId = req.params.entityId;
    const parsedData = req.body;
    const { single } = req.files as IMulterFiles;

    if (!entityId) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        staticProps.common.DATA_REQUIRED
      );
    }

    //TODO:: Check if entity exists and delete the previous image if new image is uploaded
    // if (entity.entity_image) {
    //   removeFile(entity.entity_image);
    // }

    if (single) {
      const { filePath } = await uploadFiles(single);
      parsedData.entity_image =
        filePath || staticProps.default.DEFAULT_IMAGE_PATH;
    }

    const validatedData = validateZodSchema(
      parsedData,
      EntityUpdateDtoZodSchema
    );

    const updatedEntity = await updateEntityByIdService(
      entityId,
      validatedData
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.UPDATED,
      data: updatedEntity,
    });
  }
);

// Delete a entity by ID
export const DeleteEntityById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const entityId = req.params.entityId;
    const { school_uid } = req.body;

    if (!entityId || !school_uid) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        staticProps.common.DATA_REQUIRED
      );
    }

    await deleteEntityByIdService(school_uid, entityId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.DELETED,
    });
  }
);
