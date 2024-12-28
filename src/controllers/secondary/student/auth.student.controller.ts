import { Request, Response, RequestHandler } from "express";
import { catchAsync } from "../../../middlewares";
import httpStatus from "http-status";
import { ENUM_SCHOOL_ROLES, sendResponse, staticProps } from "../../../utils";
import { signInStudentService, signUpStudentService } from "../../../services";
import { uploadFiles, validateZodSchema } from "../../../cores";
import {
  StudentLoginDtoZodSchema,
  StudentSignupDtoZodSchema,
} from "../../../validations";
import { IMulterFiles } from "../../../interfaces";

// Add or register a student
export const SignUpStudent: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const parsedData = req.body;
    const { single } = req.files as IMulterFiles;

    //add default role
    parsedData.student_role = ENUM_SCHOOL_ROLES.STUDENT;

    // Upload files
    if (single) {
      const { filePath } = await uploadFiles(single);
      parsedData.student_image =
        filePath || staticProps.default.DEFAULT_IMAGE_PATH;
    }

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
