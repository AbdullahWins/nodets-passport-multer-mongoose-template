import httpStatus from "http-status";
import { IEntityCreate, IEntitySignIn, IUploadFile } from "../../../interfaces";
import { uploadFiles, validateZodSchema } from "../../../cores";
import { ApiError } from "../../../cores";
import { EntityResponseDto } from "../../../dtos";
import { getEntityModel } from "../../../models";
import { hashString, compareString, generateJwtToken } from "../../../cores";
import { ENUM_SCHOOL_ROLES, staticProps } from "../../../utils";
import {
  EntityLoginDtoZodSchema,
  EntitySignupDtoZodSchema,
} from "../../../validations";

export const signUpEntityService = async (
  entityData: IEntityCreate,
  file: IUploadFile[] | undefined
) => {
  //add default role
  entityData.entity_role = ENUM_SCHOOL_ROLES.STUDENT;
  // Hash the password
  entityData.entity_password = await hashString(entityData.entity_password!);
  // Add default image
  entityData.entity_image = staticProps.default.DEFAULT_IMAGE_PATH;

  // Upload file if exists
  if (file) {
    const { filePath } = await uploadFiles(file);
    if (filePath) {
      entityData.entity_image = filePath;
    }
  }

  //validate the entity data
  const validatedData = validateZodSchema(entityData, EntitySignupDtoZodSchema);

  //TODO: we will check if the school exists or not here to avoid creating database and entity for non-existing school

  // Get the Entity model
  const EntityModel = await getEntityModel(validatedData.school_uid);

  // Create the entity
  const entity = await EntityModel.create(validatedData);
  if (!entity) {
    throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_CREATED);
  }

  return new EntityResponseDto(entity);
};

export const signInEntityService = async (entityData: IEntitySignIn) => {
  //validate the entity data
  const validatedData = validateZodSchema(entityData, EntityLoginDtoZodSchema);

  // Get the Entity model
  const EntityModel = await getEntityModel(validatedData.school_uid);

  // Find the entity by email
  const entity = await EntityModel.findOne({
    entity_email: validatedData.entity_email,
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
  const result = { token, entity: entityFromDto };

  return result;
};
