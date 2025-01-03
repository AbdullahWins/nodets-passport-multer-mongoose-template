import httpStatus from "http-status";
import { ITeacherCreate, ITeacherSignIn, IUploadFile } from "../../../interfaces";
import { uploadFiles, validateZodSchema } from "../../../cores";
import { ApiError } from "../../../cores";
import { TeacherResponseDto } from "../../../dtos";
import { getTeacherModel } from "../../../models";
import { hashString, compareString, generateJwtToken } from "../../../cores";
import { ENUM_TEACHER_ROLES, staticProps } from "../../../utils";
import {
  TeacherLoginDtoZodSchema,
  TeacherSignupDtoZodSchema,
} from "../../../validations";

export const signUpTeacherService = async (
  teacherData: ITeacherCreate,
  file: IUploadFile[] | undefined
) => {
  //check if the role is valid
  if (
    !Object.values(ENUM_TEACHER_ROLES).includes(
      teacherData.role as ENUM_TEACHER_ROLES
    )
  ) {
    teacherData.role = ENUM_TEACHER_ROLES.TEACHER as ENUM_TEACHER_ROLES;
  }
  // Hash the password
  teacherData.password = await hashString(teacherData.password!);
  // Add default image
  teacherData.image = staticProps.default.DEFAULT_IMAGE_PATH;

  // Upload file if exists
  if (file) {
    const { filePath } = await uploadFiles(file);
    if (filePath) {
      teacherData.image = filePath;
    }
  }

  //validate the teacher data
  const validatedData = validateZodSchema(
    teacherData,
    TeacherSignupDtoZodSchema
  );

  //TODO: we will check if the school exists or not here to avoid creating database and teacher for non-existing school

  // Get the Teacher model
  const TeacherModel = await getTeacherModel(validatedData.school_uid);

  // Create the teacher
  const teacher = await TeacherModel.create(validatedData);
  if (!teacher) {
    throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_CREATED);
  }

  return new TeacherResponseDto(teacher);
};

export const signInTeacherService = async (teacherData: ITeacherSignIn) => {
  //validate the teacher data
  const validatedData = validateZodSchema(
    teacherData,
    TeacherLoginDtoZodSchema
  );

  // Get the Teacher model
  const TeacherModel = await getTeacherModel(validatedData.school_uid);

  // Find the teacher by username
  const teacher = await TeacherModel.findOne({
    username: validatedData.username,
  });

  if (!teacher) {
    throw new ApiError(httpStatus.UNAUTHORIZED, staticProps.common.NOT_FOUND);
  }

  // Validate the password
  const isPasswordMatch = await compareString(
    teacherData.password,
    teacher.password
  );
  if (!isPasswordMatch) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      staticProps.common.INVALID_CREDENTIALS
    );
  }

  // Generate JWT token
  const jwtPayload = {
    _id: teacher._id,
    username: teacher.username,
    role: teacher.role,
  };
  const token = generateJwtToken(jwtPayload);

  // use dto to format the teacher response
  const teacherFromDto = new TeacherResponseDto(teacher);
  const result = { token, teacher: teacherFromDto };

  return result;
};
