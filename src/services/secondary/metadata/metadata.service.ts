import httpStatus from "http-status";
import { ApiError, validateZodSchema } from "../../../cores";
import { ISchoolMetadata } from "../../../interfaces";
import { staticProps } from "../../../utils";
import { SchoolMetadataAddDtoZodSchema } from "../../../validations";
import { getMetadataModel } from "../../../models/secondary/metadata";
import { MetadataResponseDto } from "../../../dtos/secondary/metadata";

export const createSchoolMetadata = async (schoolMetadata: ISchoolMetadata) => {
  //validate the schoolAdmin data
  const validatedData = validateZodSchema(
    schoolMetadata,
    SchoolMetadataAddDtoZodSchema
  );

  //TODO: we will check if the school exists or not here to avoid creating database and schoolAdmin for non-existing school

  // Get the SchoolAdmin model
  const SchoolMetadataModel = await getMetadataModel(validatedData.school_uid);

  // Create the schoolAdmin
  const result = await SchoolMetadataModel.create(validatedData);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_CREATED);
  }

  return new MetadataResponseDto(result);
};
