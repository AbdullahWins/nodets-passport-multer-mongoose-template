import httpStatus from "http-status";
import { IStudent, IStudentCreate, IStudentSignIn } from "../../../interfaces";
import { getSchoolModel } from "../../../cores";
import { ApiError } from "../../../cores";
import { StudentResponseDto } from "../../../dtos";
import { STUDENT_MODEL_NAME, StudentSchema } from "../../../models";
import { hashString, compareString, generateJwtToken } from "../../../cores";
import { staticProps } from "../../../utils";

export const signUpStudentService = async (studentData: IStudentCreate) => {
  // Get the Student model
  const StudentModel = await getSchoolModel<IStudent>(
    studentData.school_uid,
    STUDENT_MODEL_NAME,
    StudentSchema
  );

  // Hash the password
  studentData.student_password = await hashString(
    studentData.student_password!
  );

  // Create the student
  const student = await StudentModel.create(studentData);
  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_CREATED);
  }

  return new StudentResponseDto(student);
};

export const signInStudentService = async (studentData: IStudentSignIn) => {
  // Get the Student model
  const StudentModel = await getSchoolModel<IStudent>(
    studentData.school_uid,
    STUDENT_MODEL_NAME,
    StudentSchema
  );

  // Find the student by email
  const student = await StudentModel.findOne({
    student_email: studentData.student_email,
  });

  if (!student) {
    throw new ApiError(httpStatus.UNAUTHORIZED, staticProps.common.NOT_FOUND);
  }

  // Validate the password
  const isPasswordMatch = await compareString(
    studentData.student_password,
    student.student_password
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
    email: student.student_email,
    role: student.student_role,
  };
  const token = generateJwtToken(jwtPayload);

  // use dto to format the student response
  const studentFromDto = new StudentResponseDto(student);

  return { token, student: studentFromDto };
};
