import httpStatus from "http-status";
import { ISchoolAdminCreate, ISchoolAdminSignIn } from "../../../interfaces";
import { validateZodSchema } from "../../../cores";
import { ApiError } from "../../../cores";
import { SchoolAdminResponseDto } from "../../../dtos";
import { getSchoolAdminModel } from "../../../models";
import { hashString, compareString, generateJwtToken } from "../../../cores";
import { ENUM_SCHOOL_ROLES, staticProps } from "../../../utils";
import {
  SchoolAdminLoginDtoZodSchema,
  SchoolAdminSignupDtoZodSchema,
} from "../../../validations";

export const signUpSchoolAdminService = async (
  schoolAdminData: ISchoolAdminCreate
) => {
  //add default role
  schoolAdminData.role = ENUM_SCHOOL_ROLES.SCHOOL_ADMIN;
  // Hash the password
  schoolAdminData.password = await hashString(schoolAdminData.password!);

  //validate the schoolAdmin data
  const validatedData = validateZodSchema(
    schoolAdminData,
    SchoolAdminSignupDtoZodSchema
  );

  console.log("validatedData", validatedData);

  //TODO: we will check if the school exists or not here to avoid creating database and schoolAdmin for non-existing school

  // Get the SchoolAdmin model
  const SchoolAdminModel = await getSchoolAdminModel(validatedData.school_uid);

  // Create the schoolAdmin
  const schoolAdmin = await SchoolAdminModel.create(validatedData);

  console.log("schoolAdmin", schoolAdmin);

  if (!schoolAdmin) {
    throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_CREATED);
  }

  return new SchoolAdminResponseDto(schoolAdmin);
};

export const signInSchoolAdminService = async (
  schoolAdminData: ISchoolAdminSignIn
) => {
  //validate the schoolAdmin data
  const validatedData = validateZodSchema(
    schoolAdminData,
    SchoolAdminLoginDtoZodSchema
  );

  // Get the SchoolAdmin model
  const SchoolAdminModel = await getSchoolAdminModel(validatedData.school_uid);

  // Find the schoolAdmin by username
  const schoolAdmin = await SchoolAdminModel.findOne({
    username: validatedData.username,
  });

  if (!schoolAdmin) {
    throw new ApiError(httpStatus.UNAUTHORIZED, staticProps.common.NOT_FOUND);
  }

  // Validate the password
  const isPasswordMatch = await compareString(
    schoolAdminData.password,
    schoolAdmin.password
  );
  if (!isPasswordMatch) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      staticProps.common.INVALID_CREDENTIALS
    );
  }

  // Generate JWT token
  const jwtPayload = {
    _id: schoolAdmin._id,
    username: schoolAdmin.username,
    role: schoolAdmin.role,
  };
  const token = generateJwtToken(jwtPayload);

  // use dto to format the schoolAdmin response
  const schoolAdminFromDto = new SchoolAdminResponseDto(schoolAdmin);
  const result = { token, schoolAdmin: schoolAdminFromDto };

  return result;
};
