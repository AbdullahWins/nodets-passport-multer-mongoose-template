import { Request, Response, RequestHandler } from "express";
import { catchAsync } from "../../../middlewares";
import httpStatus from "http-status";
import { ENUM_SCHOOL_ROLES, sendResponse, staticProps } from "../../../utils";
import { signInStudentService, signUpStudentService } from "../../../services";
import { validateZodSchema } from "../../../cores";
import {
  StudentLoginDtoZodSchema,
  StudentSignupDtoZodSchema,
} from "../../../validations";

// Add or register a student
export const SignUpStudent: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const parsedData = req.body;

    //add default role
    parsedData.student_role = ENUM_SCHOOL_ROLES.STUDENT;

    //validate the student data
    const validatedData = validateZodSchema(
      parsedData,
      StudentSignupDtoZodSchema
    );

    const student = await signUpStudentService(validatedData);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: staticProps.common.CREATED,
      data: student,
    });
  }
);

// SignInStudent Handler
export const SignInStudent: RequestHandler = catchAsync(async (req, res) => {
  const parsedData = req.body;
  //validate the student data
  const validatedData = validateZodSchema(parsedData, StudentLoginDtoZodSchema);

  const { token, student } = await signInStudentService(validatedData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Login successful.",
    data: { token, student },
  });
});
