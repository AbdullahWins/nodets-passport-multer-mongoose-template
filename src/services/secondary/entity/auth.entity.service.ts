import httpStatus from "http-status";
import { IEntity, IEntityCreate, IEntitySignIn } from "../../../interfaces";
import { getSchoolModel } from "../../../cores";
import { ApiError } from "../../../cores";
import { EntityResponseDto } from "../../../dtos";
import { ENTITY_MODEL_NAME, EntitySchema } from "../../../models";
import { hashString, compareString, generateJwtToken } from "../../../cores";
import { staticProps } from "../../../utils";

export const signUpEntityService = async (entityData: IEntityCreate) => {
  // Get the Entity model
  const EntityModel = await getSchoolModel<IEntity>(
    entityData.school_uid,
    ENTITY_MODEL_NAME,
    EntitySchema
  );

  // Hash the password
  entityData.entity_password = await hashString(entityData.entity_password!);

  // Create the entity
  const entity = await EntityModel.create(entityData);
  if (!entity) {
    throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_CREATED);
  }

  return new EntityResponseDto(entity);
};

export const signInEntityService = async (entityData: IEntitySignIn) => {
  // Get the Entity model
  const EntityModel = await getSchoolModel<IEntity>(
    entityData.school_uid,
    ENTITY_MODEL_NAME,
    EntitySchema
  );

  // Find the entity by email
  const entity = await EntityModel.findOne({
    entity_email: entityData.entity_email,
  });

  if (!entity) {
    throw new ApiError(httpStatus.UNAUTHORIZED, staticProps.common.NOT_FOUND);
  }

  // Validate the password
  const isPasswordMatch = await compareString(
    entityData.entity_password,
    entity.entity_password
  );
  if (!isPasswordMatch) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      staticProps.common.INVALID_CREDENTIALS
    );
  }

  // Generate JWT token
  const jwtPayload = {
    _id: entity._id,
    email: entity.entity_email,
    role: entity.entity_role,
  };
  const token = generateJwtToken(jwtPayload);

  // use dto to format the entity response
  const entityFromDto = new EntityResponseDto(entity);

  return { token, entity: entityFromDto };
};
