import httpStatus from "http-status";
import { IStudent } from "../../../interfaces";
import { getSchoolModel } from "../../../cores";
import { ApiError } from "../../../cores";
import { StudentResponseDto } from "../../../dtos";
import { STUDENT_MODEL_NAME, StudentSchema } from "../../../models";
import { hashString, compareString, generateJwtToken } from "../../../cores";
import { staticProps } from "../../../utils";

export const signUpStudentService = async (
  school_uid: string,
  studentData: Partial<IStudent>
) => {
  // Get the Student model
  const StudentModel = await getSchoolModel<IStudent>(
    school_uid,
    STUDENT_MODEL_NAME,
    StudentSchema
  );

  // Hash the password
  studentData.password = await hashString(studentData.password!);

  // Create the student
  const student = await StudentModel.create(studentData);
  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_CREATED);
  }

  return new StudentResponseDto(student as IStudent);
};

export const signInStudentService = async (
  school_uid: string,
  email: string,
  password: string
) => {
  // Get the Student model
  const StudentModel = await getSchoolModel<IStudent>(
    school_uid,
    STUDENT_MODEL_NAME,
    StudentSchema
  );

  // Find the student by email
  const student = await StudentModel.findOne({ email });
  if (!student) {
    throw new ApiError(httpStatus.UNAUTHORIZED, staticProps.common.NOT_FOUND);
  }

  // Validate the password
  const isPasswordMatch = await compareString(password, student.password);
  if (!isPasswordMatch) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      staticProps.common.INVALID_CREDENTIALS
    );
  }

  // Generate JWT token
  const jwtPayload = {
    _id: student._id,
    email: student.email,
    role: student.role,
  };
  const token = generateJwtToken(jwtPayload);

  return { token, student };
};
