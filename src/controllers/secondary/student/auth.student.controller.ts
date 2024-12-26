import { Request, Response, RequestHandler } from "express";
import { catchAsync } from "../../../middlewares";
import { School, Student } from "../../../models";
import {
  ApiError,
  compareString,
  generateJwtToken,
  getSchoolModel,
  hashString,
} from "../../../cores";
import httpStatus from "http-status";
import { connectToSchoolDB } from "../../../configs";
import { sendResponse, staticProps } from "../../../utils";
import { StudentResponseDto } from "../../../dtos";
import { IStudent } from "../../../interfaces";

// Add or register a student
export const SignUpStudent: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { name, email, image, address, school_uid, password } = req.body;

    // Validate school_uid
    const school = await School.findOne({ school_uid });
    if (!school) {
      throw new ApiError(httpStatus.NOT_FOUND, "Invalid school UID.");
    }

    // Connect to the school's database
    const schoolDB = await connectToSchoolDB(school.school_db_name);
    if (!schoolDB) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        staticProps.database.CONNECTION_ERROR_SECONDARY
      );
    }

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
    const insertResult = await schoolDB
      .collection("students")
      .insertOne(studentData);

    const student = await schoolDB
      .collection("students")
      .findOne({ _id: insertResult.insertedId });

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

// Student login
export const SignInStudent: RequestHandler = catchAsync(async (req, res) => {
  const { email, password, school_uid } = req.body;

  // Validate the school
  const school = await School.findOne({ school_uid });
  if (!school) {
    throw new ApiError(httpStatus.NOT_FOUND, "Invalid school UID.");
  }

  // Get the Student model from the school's database
  const StudentModel = await getSchoolModel<IStudent>(
    school.school_db_name,
    Student
  );

  if (!StudentModel) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      staticProps.database.CONNECTION_ERROR_SECONDARY
    );
  }

  // Find the student by email
  const student = await StudentModel.findOne({ email });
  if (!student) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials.");
  }

  console.log("student", student);

  console.log("password", password);
  
  console.log("student.password", student.password);

  // Validate the password
  const isPasswordMatch = await compareString(password, student.password);
  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials.");
  }

  // Generate JWT token
  const jwtPayload = {
    _id: student._id,
    email: student.email,
    role: student.role,
  };

  console.log("jwtPayload", jwtPayload);
  const token = generateJwtToken(jwtPayload);

  // Respond with success
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Login successful.",
    data: { token, student: new StudentResponseDto(student) },
  });
});
