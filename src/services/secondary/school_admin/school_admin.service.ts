// src/services/schoolAdmin/schoolAdmin.service.ts
import httpStatus from "http-status";
import { paginate, staticProps } from "../../../utils";
import {
  ApiError,
  validateZodSchema,
} from "../../../cores";
import { SchoolAdminResponseDto } from "../../../dtos";
import { ISchoolAdminUpdate } from "../../../interfaces";
import { getSchoolAdminModel } from "../../../models";
import { SchoolAdminUpdateDtoZodSchema } from "../../../validations";

// Get all schoolAdmins with pagination
export const getAllSchoolAdminsService = async (
  school_uid: string,
  page: number,
  limit: number
) => {
  if (!school_uid) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      staticProps.common.DATA_REQUIRED
    );
  }

  const SchoolAdminModel = await getSchoolAdminModel(school_uid);

  const paginatedResult = await paginate(SchoolAdminModel.find(), {
    page,
    limit,
  });

  const schoolAdminsFromDto = paginatedResult.data.map(
    (schoolAdmin) => new SchoolAdminResponseDto(schoolAdmin.toObject())
  );

  return { schoolAdminsFromDto, meta: paginatedResult.meta };
};

// Get a schoolAdmin by ID
export const getSchoolAdminByIdService = async (
  school_uid: string | undefined,
  schoolAdminId: string | undefined
) => {
  if (!schoolAdminId || !school_uid) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      staticProps.common.DATA_REQUIRED
    );
  }

  const SchoolAdminModel = await getSchoolAdminModel(school_uid);

  const schoolAdmin = await SchoolAdminModel.findById(schoolAdminId);
  if (!schoolAdmin) {
    throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
  }

  return new SchoolAdminResponseDto(schoolAdmin);
};

// Update a schoolAdmin by ID
export const updateSchoolAdminByIdService = async (
  schoolAdminId: string | undefined,
  data: ISchoolAdminUpdate,
) => {
  if (!schoolAdminId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      staticProps.common.DATA_REQUIRED
    );
  }

  const validatedData = validateZodSchema(data, SchoolAdminUpdateDtoZodSchema);

  if (!validatedData.school_uid) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      staticProps.common.DATA_REQUIRED
    );
  }

  const SchoolAdminModel = await getSchoolAdminModel(validatedData.school_uid);

  const schoolAdmin = await SchoolAdminModel.findById(schoolAdminId);
  if (!schoolAdmin) {
    throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
  }

  const updatedSchoolAdmin = await SchoolAdminModel.findOneAndUpdate(
    { _id: schoolAdminId },
    { $set: validatedData },
    { new: true, runValidators: true }
  );

  if (!updatedSchoolAdmin) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      staticProps.common.FAILED_TO_UPDATE
    );
  }

  return new SchoolAdminResponseDto(updatedSchoolAdmin);
};

// Delete a schoolAdmin by ID
export const deleteSchoolAdminByIdService = async (
  school_uid: string,
  schoolAdminId: string | undefined
) => {
  if (!schoolAdminId || !school_uid) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      staticProps.common.DATA_REQUIRED
    );
  }

  const SchoolAdminModel = await getSchoolAdminModel(school_uid);

  const result = await SchoolAdminModel.deleteOne({ _id: schoolAdminId });

  if (result.deletedCount === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
  }

  return result;
};
