import httpStatus from "http-status";
import { Request, Response } from "express";
import { catchAsync } from "../../../middlewares";
import { sendResponse, parseQueryData, staticProps } from "../../../utils";
import {
  getAllSchoolsService,
  getSchoolByIdService,
  addSchoolService,
  updateSchoolByIdService,
  deleteSchoolByIdService,
} from "../../../services";

// Get all schools with pagination
export const GetAllSchools = catchAsync(async (req: Request, res: Response) => {
  const { page, limit } = parseQueryData(req.query);

  const result = await getAllSchoolsService(page, limit);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: staticProps.common.RETRIEVED,
    data: result.schoolsFromDto,
    meta: result.meta,
  });
});

// Get a school by ID
export const GetSchoolById = catchAsync(async (req: Request, res: Response) => {
  const { schoolId } = req.params;

  const school = await getSchoolByIdService(schoolId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: staticProps.common.RETRIEVED,
    data: school,
  });
});

// Add a new school
export const AddOneSchool = catchAsync(async (req: Request, res: Response) => {
  const parsedData = req.body;
  const { single } = req.files as any;

  const school = await addSchoolService(parsedData, single);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: staticProps.common.CREATED,
    data: school,
  });
});

// Update a school by ID
export const UpdateSchoolById = catchAsync(
  async (req: Request, res: Response) => {
    const { schoolId } = req.params;
    const parsedData = req.body;

    const school = await updateSchoolByIdService(schoolId, parsedData);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.UPDATED,
      data: school,
    });
  }
);

// Delete a school by ID
export const DeleteSchoolById = catchAsync(
  async (req: Request, res: Response) => {
    const { schoolId } = req.params;

    await deleteSchoolByIdService(schoolId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: staticProps.common.DELETED,
    });
  }
);
