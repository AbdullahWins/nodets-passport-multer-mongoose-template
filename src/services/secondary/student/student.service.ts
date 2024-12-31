// src/services/student/student.service.ts
import httpStatus from "http-status";
import { ENUM_STUDENT_STATUS, paginate, staticProps } from "../../../utils";
import {
  ApiError,
  removeFile,
  uploadFiles,
  validateZodSchema,
} from "../../../cores";
import { StudentResponseDto } from "../../../dtos";
import { IStudentUpdate, IUploadFile } from "../../../interfaces";
import { getStudentModel } from "../../../models";
import { StudentUpdateDtoZodSchema } from "../../../validations";

// Get all students with pagination
export const getAllStudentsService = async (
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

  const StudentModel = await getStudentModel(school_uid);

  const paginatedResult = await paginate(StudentModel.find(), { page, limit });

  const studentsFromDto = paginatedResult.data.map(
    (student) => new StudentResponseDto(student.toObject())
  );

  return { studentsFromDto, meta: paginatedResult.meta };
};

// Get all pending students (applied for admission)
export const getAllPendingStudentsService = async (
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

  const StudentModel = await getStudentModel(school_uid);

  const paginatedResult = await paginate(
    StudentModel.find({ status: ENUM_STUDENT_STATUS.PENDING }),
    { page, limit }
  );

  const studentsFromDto = paginatedResult.data.map(
    (student) => new StudentResponseDto(student.toObject())
  );

  return { studentsFromDto, meta: paginatedResult.meta };
};


// Get a student by ID
export const getStudentByIdService = async (
  school_uid: string | undefined,
  studentId: string | undefined
) => {
  if (!studentId || !school_uid) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      staticProps.common.DATA_REQUIRED
    );
  }

  const StudentModel = await getStudentModel(school_uid);

  const student = await StudentModel.findById(studentId);
  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
  }

  return new StudentResponseDto(student);
};

// Update a student by ID
export const updateStudentByIdService = async (
  studentId: string | undefined,
  data: IStudentUpdate,
  single: IUploadFile[] | undefined
) => {
  if (!studentId) {
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

  const validatedData = validateZodSchema(data, StudentUpdateDtoZodSchema);

  if (!validatedData.school_uid) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      staticProps.common.DATA_REQUIRED
    );
  }

  const StudentModel = await getStudentModel(validatedData.school_uid);

  const student = await StudentModel.findById(studentId);
  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
  }

  const updatedStudent = await StudentModel.findOneAndUpdate(
    { _id: studentId },
    { $set: validatedData },
    { new: true, runValidators: true }
  );

  if (!updatedStudent) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      staticProps.common.FAILED_TO_UPDATE
    );
  }

  return new StudentResponseDto(updatedStudent);
};

// Delete a student by ID
export const deleteStudentByIdService = async (
  school_uid: string,
  studentId: string | undefined
) => {
  if (!studentId || !school_uid) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      staticProps.common.DATA_REQUIRED
    );
  }

  const StudentModel = await getStudentModel(school_uid);

  const result = await StudentModel.deleteOne({ _id: studentId });

  if (result.deletedCount === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
  }

  return result;
};
