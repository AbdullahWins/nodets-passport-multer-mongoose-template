import { Request, Response, RequestHandler } from "express";
import { catchAsync } from "../../../middlewares";
import {
  ApiError,
  compareString,
  generateJwtToken,
  getSchoolModel,
  hashString,
} from "../../../cores";
import httpStatus from "http-status";
import { sendResponse, staticProps } from "../../../utils";
import { StudentResponseDto } from "../../../dtos";
import { IStudent } from "../../../interfaces";
import {
  STUDENT_MODEL_NAME,
  StudentSchema,
} from "../../../models/secondary/student/student.model";
import { getDatabaseFromUid } from "../../../utils/helpers/dbFinder.helper";

// Add or register a student
export const SignUpStudent: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { name, email, image, address, school_uid, password } = req.body;

    const school_db_name = getDatabaseFromUid(school_uid);

    // Step 2: Get the Student model from the school's database
    const StudentModel = await getSchoolModel<IStudent>(
      school_db_name,
      STUDENT_MODEL_NAME,
      StudentSchema
    );

    // Hash the password (assuming bcrypt is used for hashing)
    const hashedPassword = await hashString(password);

    // Construct student data
    const studentData = {
      name,
      email,
      image,
      address,
      password: hashedPassword,
    };

    // Add the student to the school's database
    const student = await StudentModel.create(studentData);

    if (!student) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    const studentFromDto = new StudentResponseDto(student as IStudent);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: staticProps.common.CREATED,
      data: studentFromDto,
    });
  }
);

// SignInStudent Handler
export const SignInStudent: RequestHandler = catchAsync(async (req, res) => {
  const { email, password, school_uid } = req.body;

  const school_db_name = getDatabaseFromUid(school_uid);

  // Step 2: Get the Student model from the school's database
  const StudentModel = await getSchoolModel<IStudent>(
    school_db_name,
    STUDENT_MODEL_NAME,
    StudentSchema
  );

  // Step 3: Find the student by email
  const student = await StudentModel.findOne({ email });
  if (!student) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Not Found.");
  }

  // Step 4: Validate the password
  const isPasswordMatch = await compareString(password, student.password);
  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials.");
  }

  // Step 5: Generate JWT token
  const jwtPayload = {
    _id: student._id,
    email: student.email,
    role: student.role,
  };
  const token = generateJwtToken(jwtPayload);

  // Step 6: Respond with success
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Login successful.",
    data: { token, student },
  });
});
