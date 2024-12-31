// src/services/teacher/teacher.service.ts
import httpStatus from "http-status";
import { paginate, staticProps } from "../../../utils";
import {
  ApiError,
  removeFile,
  uploadFiles,
  validateZodSchema,
} from "../../../cores";
import { TeacherResponseDto } from "../../../dtos";
import { ITeacherUpdate, IUploadFile } from "../../../interfaces";
import { getTeacherModel } from "../../../models";
import { TeacherUpdateDtoZodSchema } from "../../../validations";

// Get all teachers with pagination
export const getAllTeachersService = async (
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

  const TeacherModel = await getTeacherModel(school_uid);

  const paginatedResult = await paginate(TeacherModel.find(), { page, limit });

  const teachersFromDto = paginatedResult.data.map(
    (teacher) => new TeacherResponseDto(teacher.toObject())
  );

  return { teachersFromDto, meta: paginatedResult.meta };
};

// Get a teacher by ID
export const getTeacherByIdService = async (
  school_uid: string | undefined,
  teacherId: string | undefined
) => {
  if (!teacherId || !school_uid) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      staticProps.common.DATA_REQUIRED
    );
  }

  const TeacherModel = await getTeacherModel(school_uid);

  const teacher = await TeacherModel.findById(teacherId);
  if (!teacher) {
    throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
  }

  return new TeacherResponseDto(teacher);
};

// Update a teacher by ID
export const updateTeacherByIdService = async (
  teacherId: string | undefined,
  data: ITeacherUpdate,
  single: IUploadFile[] | undefined
) => {
  if (!teacherId) {
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

  const validatedData = validateZodSchema(data, TeacherUpdateDtoZodSchema);

  if (!validatedData.school_uid) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      staticProps.common.DATA_REQUIRED
    );
  }

  const TeacherModel = await getTeacherModel(validatedData.school_uid);

  const teacher = await TeacherModel.findById(teacherId);
  if (!teacher) {
    throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
  }

  const updatedTeacher = await TeacherModel.findOneAndUpdate(
    { _id: teacherId },
    { $set: validatedData },
    { new: true, runValidators: true }
  );

  if (!updatedTeacher) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      staticProps.common.FAILED_TO_UPDATE
    );
  }

  return new TeacherResponseDto(updatedTeacher);
};

// Delete a teacher by ID
export const deleteTeacherByIdService = async (
  school_uid: string,
  teacherId: string | undefined
) => {
  if (!teacherId || !school_uid) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      staticProps.common.DATA_REQUIRED
    );
  }

  const TeacherModel = await getTeacherModel(school_uid);

  const result = await TeacherModel.deleteOne({ _id: teacherId });

  if (result.deletedCount === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
  }

  return result;
};
