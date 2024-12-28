import { Request, Response, RequestHandler } from "express";
import { catchAsync } from "../../../middlewares";
import httpStatus from "http-status";
import { sendResponse, staticProps } from "../../../utils";
import { signInStudentService, signUpStudentService } from "../../../services";

// Add or register a student
export const SignUpStudent: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { name, email, image, address, school_uid, password } = req.body;

    const studentData = {
      name,
      email,
      image,
      address,
      password,
    };

    const student = await signUpStudentService(school_uid, studentData);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: staticProps.common.CREATED,
      data: student,
    });
  }
);

// SignInStudent Handler
export const SignInStudent: RequestHandler = catchAsync(async (req, res) => {
  const { email, password, school_uid } = req.body;

  const { token, student } = await signInStudentService(
    school_uid,
    email,
    password
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Login successful.",
    data: { token, student },
  });
});
