// src/services/headTeacher/headTeacher.service.ts
import httpStatus from "http-status";
import { paginate, staticProps } from "../../../utils";
import {
  ApiError,
  removeFile,
  uploadFiles,
  validateZodSchema,
} from "../../../cores";
import { HeadTeacherResponseDto } from "../../../dtos";
import { IHeadTeacherUpdate, IUploadFile } from "../../../interfaces";
import { getHeadTeacherModel } from "../../../models";
import { HeadTeacherUpdateDtoZodSchema } from "../../../validations";

// Get all headTeachers with pagination
export const getAllHeadTeachersService = async (
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

  const HeadTeacherModel = await getHeadTeacherModel(school_uid);

  const paginatedResult = await paginate(HeadTeacherModel.find(), { page, limit });

  const headTeachersFromDto = paginatedResult.data.map(
    (headTeacher) => new HeadTeacherResponseDto(headTeacher.toObject())
  );

  return { headTeachersFromDto, meta: paginatedResult.meta };
};

// Get a headTeacher by ID
export const getHeadTeacherByIdService = async (
  school_uid: string | undefined,
  headTeacherId: string | undefined
) => {
  if (!headTeacherId || !school_uid) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      staticProps.common.DATA_REQUIRED
    );
  }

  const HeadTeacherModel = await getHeadTeacherModel(school_uid);

  const headTeacher = await HeadTeacherModel.findById(headTeacherId);
  if (!headTeacher) {
    throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
  }

  return new HeadTeacherResponseDto(headTeacher);
};

// Update a headTeacher by ID
export const updateHeadTeacherByIdService = async (
  headTeacherId: string | undefined,
  data: IHeadTeacherUpdate,
  single: IUploadFile[] | undefined
) => {
  if (!headTeacherId) {
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

  const validatedData = validateZodSchema(data, HeadTeacherUpdateDtoZodSchema);

  if (!validatedData.school_uid) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      staticProps.common.DATA_REQUIRED
    );
  }

  const HeadTeacherModel = await getHeadTeacherModel(validatedData.school_uid);

  const headTeacher = await HeadTeacherModel.findById(headTeacherId);
  if (!headTeacher) {
    throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
  }

  const updatedHeadTeacher = await HeadTeacherModel.findOneAndUpdate(
    { _id: headTeacherId },
    { $set: validatedData },
    { new: true, runValidators: true }
  );

  if (!updatedHeadTeacher) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      staticProps.common.FAILED_TO_UPDATE
    );
  }

  return new HeadTeacherResponseDto(updatedHeadTeacher);
};

// Delete a headTeacher by ID
export const deleteHeadTeacherByIdService = async (
  school_uid: string,
  headTeacherId: string | undefined
) => {
  if (!headTeacherId || !school_uid) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      staticProps.common.DATA_REQUIRED
    );
  }

  const HeadTeacherModel = await getHeadTeacherModel(school_uid);

  const result = await HeadTeacherModel.deleteOne({ _id: headTeacherId });

  if (result.deletedCount === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
  }

  return result;
};
