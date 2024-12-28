// src/services/entity/entity.service.ts
import httpStatus from "http-status";
import { paginate } from "../../../utils";
import { ApiError } from "../../../cores";
import { getSchoolModel } from "../../../cores";
import { EntityResponseDto } from "../../../dtos";
import { IEntity, IEntityUpdate } from "../../../interfaces";
import { EntitySchema, ENTITY_MODEL_NAME } from "../../../models";

// Get all entitys with pagination
export const getAllEntitysService = async (
  school_uid: string,
  page: number,
  limit: number
) => {
  const EntityModel = await getSchoolModel<IEntity>(
    school_uid,
    ENTITY_MODEL_NAME,
    EntitySchema
  );

  const paginatedResult = await paginate(EntityModel.find(), { page, limit });

  const entitysFromDto = paginatedResult.data.map(
    (entity) => new EntityResponseDto(entity.toObject())
  );

  return { entitysFromDto, meta: paginatedResult.meta };
};

// Get a entity by ID
export const getEntityByIdService = async (
  school_uid: string,
  entityId: string
) => {
  const EntityModel = await getSchoolModel<IEntity>(
    school_uid,
    ENTITY_MODEL_NAME,
    EntitySchema
  );

  const entity = await EntityModel.findById(entityId);
  if (!entity) {
    throw new ApiError(httpStatus.NOT_FOUND, "Entity not found.");
  }

  return new EntityResponseDto(entity);
};

// Update a entity by ID
export const updateEntityByIdService = async (
  entityId: string,
  updateData: IEntityUpdate
) => {
  const EntityModel = await getSchoolModel<IEntity>(
    updateData.school_uid,
    ENTITY_MODEL_NAME,
    EntitySchema
  );

  const entity = await EntityModel.findById(entityId);
  if (!entity) {
    throw new ApiError(httpStatus.NOT_FOUND, "Entity not found.");
  }

  const updatedEntity = await EntityModel.findOneAndUpdate(
    { _id: entityId },
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!updatedEntity) {
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to update entity.");
  }

  return new EntityResponseDto(updatedEntity);
};

// Delete a entity by ID
export const deleteEntityByIdService = async (
  school_uid: string,
  entityId: string
) => {
  const EntityModel = await getSchoolModel<IEntity>(
    school_uid,
    ENTITY_MODEL_NAME,
    EntitySchema
  );

  const result = await EntityModel.deleteOne({ _id: entityId });

  if (result.deletedCount === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "Entity not found.");
  }

  return result;
};
