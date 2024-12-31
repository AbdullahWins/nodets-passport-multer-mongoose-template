import httpStatus from "http-status";
import {
  IHeadTeacherCreate,
  IHeadTeacherSignIn,
  IUploadFile,
} from "../../../interfaces";
import { uploadFiles, validateZodSchema } from "../../../cores";
import { ApiError } from "../../../cores";
import { HeadTeacherResponseDto } from "../../../dtos";
import { getHeadTeacherModel } from "../../../models";
import { hashString, compareString, generateJwtToken } from "../../../cores";
import { ENUM_SCHOOL_ROLES, staticProps } from "../../../utils";
import {
  HeadTeacherLoginDtoZodSchema,
  HeadTeacherSignupDtoZodSchema,
} from "../../../validations";

export const signUpHeadTeacherService = async (
  headHeadTeacherData: IHeadTeacherCreate,
  file: IUploadFile[] | undefined
) => {
  //add default role
  headHeadTeacherData.role = ENUM_SCHOOL_ROLES.TEACHER;
  // Hash the password
  headHeadTeacherData.password = await hashString(
    headHeadTeacherData.password!
  );
  // Add default image
  headHeadTeacherData.image = staticProps.default.DEFAULT_IMAGE_PATH;

  // Upload file if exists
  if (file) {
    const { filePath } = await uploadFiles(file);
    if (filePath) {
      headHeadTeacherData.image = filePath;
    }
  }

  //validate the headHeadTeacher data
  const validatedData = validateZodSchema(
    headHeadTeacherData,
    HeadTeacherSignupDtoZodSchema
  );

  //TODO: we will check if the school exists or not here to avoid creating database and headHeadTeacher for non-existing school

  // Get the HeadTeacher model
  const HeadTeacherModel = await getHeadTeacherModel(validatedData.school_uid);

  // Create the headHeadTeacher
  const headHeadTeacher = await HeadTeacherModel.create(validatedData);
  if (!headHeadTeacher) {
    throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_CREATED);
  }

  return new HeadTeacherResponseDto(headHeadTeacher);
};

export const signInHeadTeacherService = async (
  headHeadTeacherData: IHeadTeacherSignIn
) => {
  //validate the headHeadTeacher data
  const validatedData = validateZodSchema(
    headHeadTeacherData,
    HeadTeacherLoginDtoZodSchema
  );

  // Get the HeadTeacher model
  const HeadTeacherModel = await getHeadTeacherModel(validatedData.school_uid);

  // Find the headHeadTeacher by username
  const headHeadTeacher = await HeadTeacherModel.findOne({
    username: validatedData.username,
  });

  if (!headHeadTeacher) {
    throw new ApiError(httpStatus.UNAUTHORIZED, staticProps.common.NOT_FOUND);
  }

  // Validate the password
  const isPasswordMatch = await compareString(
    headHeadTeacherData.password,
    headHeadTeacher.password
  );
  if (!isPasswordMatch) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      staticProps.common.INVALID_CREDENTIALS
    );
  }

  // Generate JWT token
  const jwtPayload = {
    _id: headHeadTeacher._id,
    username: headHeadTeacher.username,
    role: headHeadTeacher.role,
  };
  const token = generateJwtToken(jwtPayload);

  // use dto to format the headHeadTeacher response
  const headHeadTeacherFromDto = new HeadTeacherResponseDto(headHeadTeacher);
  const result = { token, headHeadTeacher: headHeadTeacherFromDto };

  return result;
};
