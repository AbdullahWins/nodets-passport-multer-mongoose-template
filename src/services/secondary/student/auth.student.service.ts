import httpStatus from "http-status";
import { IStudentCreate, IStudentSignIn, IUploadFile } from "../../../interfaces";
import { uploadFiles, validateZodSchema } from "../../../cores";
import { ApiError } from "../../../cores";
import { StudentResponseDto } from "../../../dtos";
import { getStudentModel } from "../../../models";
import { hashString, compareString, generateJwtToken } from "../../../cores";
import { ENUM_SCHOOL_ROLES, staticProps } from "../../../utils";
import {
  StudentLoginDtoZodSchema,
  StudentSignupDtoZodSchema,
} from "../../../validations";

export const signUpStudentService = async (
  studentData: IStudentCreate,
  file: IUploadFile[] | undefined
) => {
  //add default role
  studentData.role = ENUM_SCHOOL_ROLES.STUDENT;
  // Hash the password
  studentData.password = await hashString(studentData.password!);
  // Add default image
  studentData.image = staticProps.default.DEFAULT_IMAGE_PATH;

  // Upload file if exists
  if (file) {
    const { filePath } = await uploadFiles(file);
    if (filePath) {
      studentData.image = filePath;
    }
  }

  //validate the student data
  const validatedData = validateZodSchema(studentData, StudentSignupDtoZodSchema);

  //TODO: we will check if the school exists or not here to avoid creating database and student for non-existing school

  // Get the Student model
  const StudentModel = await getStudentModel(validatedData.school_uid);

  // Create the student
  const student = await StudentModel.create(validatedData);
  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_CREATED);
  }

  return new StudentResponseDto(student);
};

export const signInStudentService = async (studentData: IStudentSignIn) => {
  //validate the student data
  const validatedData = validateZodSchema(
    studentData,
    StudentLoginDtoZodSchema
  );

  // Get the Student model
  const StudentModel = await getStudentModel(validatedData.school_uid);

  // Find the student by username
  const student = await StudentModel.findOne({
    username: validatedData.username,
  });

  if (!student) {
    throw new ApiError(httpStatus.UNAUTHORIZED, staticProps.common.NOT_FOUND);
  }

  // Validate the password
  const isPasswordMatch = await compareString(
    studentData.password,
    student.password
  );
  if (!isPasswordMatch) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      staticProps.common.INVALID_CREDENTIALS
    );
  }

  // Generate JWT token
  const jwtPayload = {
    _id: student._id,
    username: student.username,
    role: student.role,
  };
  const token = generateJwtToken(jwtPayload);

  // use dto to format the student response
  const studentFromDto = new StudentResponseDto(student);
  const result = { token, student: studentFromDto };

  return result;
};
