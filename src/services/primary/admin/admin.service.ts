// src/services/admin/admin.service.ts
import httpStatus from "http-status";
import { paginate, staticProps } from "../../../utils";
import {
  ApiError,
  removeFile,
  uploadFiles,
  validateZodSchema,
} from "../../../cores";
import { AdminResponseDto } from "../../../dtos";
import { IAdminUpdate, IUploadFile } from "../../../interfaces";
import { AdminUpdateDtoZodSchema } from "../../../validations";
import { Admin } from "../../../models";

// Get all admins with pagination
export const getAllAdminsService = async (
  page: number,
  limit: number
) => {

  const paginatedResult = await paginate(Admin.find(), { page, limit });

  const adminsFromDto = paginatedResult.data.map(
    (admin) => new AdminResponseDto(admin.toObject())
  );

  return { adminsFromDto, meta: paginatedResult.meta };
};

// Get a admin by ID
export const getAdminByIdService = async (
  adminId: string | undefined
) => {
  if (!adminId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      staticProps.common.DATA_REQUIRED
    );
  }

  const admin = await Admin.findById(adminId);
  if (!admin) {
    throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
  }

  return new AdminResponseDto(admin);
};

// Update a admin by ID
export const updateAdminByIdService = async (
  adminId: string | undefined,
  data: IAdminUpdate,
  single: IUploadFile[] | undefined
) => {
  if (!adminId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      staticProps.common.DATA_REQUIRED
    );
  }

  if (single) {
    try {
      const { filePath } = await uploadFiles(single);

      if (data.image) {
        removeFile(data.image);
      }

      data.image = filePath || staticProps.default.DEFAULT_IMAGE_PATH;
    } catch (error) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        staticProps.common.FAILED_TO_UPLOAD_FILE
      );
    }
  }

  const validatedData = validateZodSchema(data, AdminUpdateDtoZodSchema);

  const admin = await Admin.findById(adminId);
  if (!admin) {
    throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
  }

  const updatedAdmin = await Admin.findOneAndUpdate(
    { _id: adminId },
    { $set: validatedData },
    { new: true, runValidators: true }
  );

  if (!updatedAdmin) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      staticProps.common.FAILED_TO_UPDATE
    );
  }

  return new AdminResponseDto(updatedAdmin);
};

// Delete a admin by ID
export const deleteAdminByIdService = async (
  adminId: string | undefined
) => {
  if (!adminId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      staticProps.common.DATA_REQUIRED
    );
  }

  const result = await Admin.deleteOne({ _id: adminId });

  if (result.deletedCount === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
  }

  return result;
};
