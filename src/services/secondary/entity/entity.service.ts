// src/services/entity/entity.service.ts
import httpStatus from "http-status";
import { paginate, staticProps } from "../../../utils";
import {
  ApiError,
  removeFile,
  uploadFiles,
  validateZodSchema,
} from "../../../cores";
import { EntityResponseDto } from "../../../dtos";
import { IEntityUpdate, IUploadFile } from "../../../interfaces";
import { getEntityModel } from "../../../models";
import { EntityUpdateDtoZodSchema } from "../../../validations";

// Get all entitys with pagination
export const getAllEntitysService = async (
  school_uid: string,
  page: number,
  limit: number
) => {
  if (!school_uid) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      staticProps.common.DATA_REQUIRED
    );
  }

  const EntityModel = await getEntityModel(school_uid);

  const paginatedResult = await paginate(EntityModel.find(), { page, limit });

  const entitysFromDto = paginatedResult.data.map(
    (entity) => new EntityResponseDto(entity.toObject())
  );

  return { entitysFromDto, meta: paginatedResult.meta };
};

// Get a entity by ID
export const getEntityByIdService = async (
  school_uid: string | undefined,
  entityId: string | undefined
) => {
  if (!entityId || !school_uid) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      staticProps.common.DATA_REQUIRED
    );
  }

  const EntityModel = await getEntityModel(school_uid);

  const entity = await EntityModel.findById(entityId);
  if (!entity) {
    throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
  }

  return new EntityResponseDto(entity);
};

// Update a entity by ID
export const updateEntityByIdService = async (
  entityId: string | undefined,
  data: IEntityUpdate,
  single: IUploadFile[] | undefined
) => {
  if (!entityId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      staticProps.common.DATA_REQUIRED
    );
  }

  if (single) {
    try {
      const { filePath } = await uploadFiles(single);

      if (data.entity_image) {
        removeFile(data.entity_image);
      }

      data.entity_image = filePath || staticProps.default.DEFAULT_IMAGE_PATH;
    } catch (error) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        staticProps.common.FAILED_TO_UPLOAD_FILE
      );
    }
  }

  const validatedData = validateZodSchema(data, EntityUpdateDtoZodSchema);

  if (!validatedData.school_uid) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      staticProps.common.DATA_REQUIRED
    );
  }

  const EntityModel = await getEntityModel(validatedData.school_uid);

  const entity = await EntityModel.findById(entityId);
  if (!entity) {
    throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
  }

  const updatedEntity = await EntityModel.findOneAndUpdate(
    { _id: entityId },
    { $set: validatedData },
    { new: true, runValidators: true }
  );

  if (!updatedEntity) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      staticProps.common.FAILED_TO_UPDATE
    );
  }

  return new EntityResponseDto(updatedEntity);
};

// Delete a entity by ID
export const deleteEntityByIdService = async (
  school_uid: string,
  entityId: string | undefined
) => {
  if (!entityId || !school_uid) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      staticProps.common.DATA_REQUIRED
    );
  }

  const EntityModel = await getEntityModel(school_uid);

  const result = await EntityModel.deleteOne({ _id: entityId });

  if (result.deletedCount === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
  }

  return result;
};
