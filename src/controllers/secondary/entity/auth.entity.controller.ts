import { Request, Response, RequestHandler } from "express";
import { catchAsync } from "../../../middlewares";
import httpStatus from "http-status";
import { ENUM_SCHOOL_ROLES, sendResponse, staticProps } from "../../../utils";
import { signInEntityService, signUpEntityService } from "../../../services";
import { uploadFiles, validateZodSchema } from "../../../cores";
import {
  EntityLoginDtoZodSchema,
  EntitySignupDtoZodSchema,
} from "../../../validations";
import { IMulterFiles } from "../../../interfaces";

// Add or register a entity
export const SignUpEntity: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const parsedData = req.body;
    const { single } = req.files as IMulterFiles;

    //add default role
    parsedData.entity_role = ENUM_SCHOOL_ROLES.STUDENT;

    // Upload files
    if (single) {
      const { filePath } = await uploadFiles(single);
      parsedData.entity_image =
        filePath || staticProps.default.DEFAULT_IMAGE_PATH;
    }

    //validate the entity data
    const validatedData = validateZodSchema(
      parsedData,
      EntitySignupDtoZodSchema
    );

    const entity = await signUpEntityService(validatedData);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: staticProps.common.CREATED,
      data: entity,
    });
  }
);

// SignInEntity Handler
export const SignInEntity: RequestHandler = catchAsync(async (req, res) => {
  const parsedData = req.body;
  //validate the entity data
  const validatedData = validateZodSchema(parsedData, EntityLoginDtoZodSchema);

  const { token, entity } = await signInEntityService(validatedData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Login successful.",
    data: { token, entity },
  });
});
