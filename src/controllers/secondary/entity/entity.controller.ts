// src/controllers/entity/entity.controller.ts
import httpStatus from "http-status";
import { Request, Response, RequestHandler } from "express";
import { catchAsync } from "../../../middlewares";
import { parseQueryData, sendResponse, staticProps } from "../../../utils";
import {
  getAllEntitysService,
  getEntityByIdService,
  updateEntityByIdService,
  deleteEntityByIdService,
} from "../../../services";
import { IMulterFiles } from "../../../interfaces";

// Get all entitys with pagination
export const GetAllEntitys: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { page, limit } = parseQueryData(req.query);
    const { school_uid } = req.body;

    const result = await getAllEntitysService(school_uid, page, limit);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: result.entitysFromDto,
      meta: result.meta,
    });
  }
);

// Get a entity by ID
export const GetEntityById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { entityId } = req.params;
    const { school_uid } = req.body;

    const result = await getEntityByIdService(school_uid, entityId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.RETRIEVED,
      data: result,
    });
  }
);

// Update a entity by ID
export const UpdateEntityById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const entityId = req.params.entityId;
    const parsedData = req.body;
    const { single } = (req.files as IMulterFiles) || {};

    const updatedEntity = await updateEntityByIdService(
      entityId,
      parsedData,
      single
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

    await deleteEntityByIdService(school_uid, entityId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.DELETED,
    });
  }
);
