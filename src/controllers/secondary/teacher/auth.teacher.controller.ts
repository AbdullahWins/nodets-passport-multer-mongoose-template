import { Request, Response, RequestHandler } from "express";
import { catchAsync } from "../../../middlewares";
import { School } from "../../../models";
import {
  ApiError,
  compareString,
  generateJwtToken,
  hashString,
} from "../../../cores";
import httpStatus from "http-status";
import { connectToSchoolDB } from "../../../configs";
import { sendResponse, staticProps } from "../../../utils";
import { TeacherResponseDto } from "../../../dtos";
import { ITeacher } from "../../../interfaces";

// Add or register a teacher
export const SignUpTeacher: RequestHandler = catchAsync(
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

    // Construct teacher data
    const teacherData = {
      name,
      email,
      image,
      address,
      password: hashedPassword,
    };

    // Add the teacher to the school's database
    const insertResult = await schoolDB
      .collection("teachers")
      .insertOne(teacherData);

    const teacher = await schoolDB
      .collection("teachers")
      .findOne({ _id: insertResult.insertedId });

    if (!teacher) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }

    const teacherFromDto = new TeacherResponseDto(teacher as ITeacher);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: staticProps.common.CREATED,
      data: teacherFromDto,
    });
  }
);

// Teacher login
export const SignInTeacher: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { email, password, school_uid } = req.body;

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

    // Find teacher by email
    const teacher = await schoolDB.collection("teachers").findOne({ email });
    if (!teacher) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials.");
    }

    // Compare the password
    const isPasswordMatch = await compareString(password, teacher.password);
    if (!isPasswordMatch) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials.");
    }

    // Generate a JWT token (assuming JWT is used)
    const jwtPayload = {
      _id: teacher._id,
      email: teacher.email,
      role: teacher.role,
    };
    const token = generateJwtToken(jwtPayload);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Login successful.",
      data: { token, teacher: new TeacherResponseDto(teacher as ITeacher) },
    });
  }
);
