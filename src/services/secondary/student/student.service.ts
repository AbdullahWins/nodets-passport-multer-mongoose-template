import httpStatus from "http-status";
import { ENUM_STUDENT_STATUS, paginate, staticProps } from "../../../utils";
import {
  ApiError,
  setCache,
  removeFile,
  uploadFiles,
  validateZodSchema,
  cacheDatabaseQuery,
  deleteCache,
  clearCacheByPattern,
} from "../../../cores";
import { StudentResponseDto } from "../../../dtos";
import { IStudentUpdate, IUploadFile } from "../../../interfaces";
import { getStudentModel } from "../../../models";
import { StudentUpdateDtoZodSchema } from "../../../validations";

// Generate cache key for student or any other entity
const generateCacheKey = (
  entity: string,
  school_uid: string,
  itemId: string | undefined,
  page?: number,
  limit?: number
): string => {
  if (page && limit) {
    return `${entity}:${school_uid}:page:${page}:limit:${limit}`;
  } else {
    return `${entity}:${school_uid}:${itemId}`;
  }
};

// Get all students with pagination
export const getAllStudentsService = async (
  school_uid: string,
  page: number,
  limit: number
): Promise<{ studentsFromDto: StudentResponseDto[]; meta: any }> => {
  const cacheKey = generateCacheKey(
    "students",
    school_uid,
    undefined,
    page,
    limit
  );
  return cacheDatabaseQuery(cacheKey, 3600, async () => {
    const StudentModel = await getStudentModel(school_uid);
    const paginatedResult = await paginate(StudentModel.find(), {
      page,
      limit,
    });
    const studentsFromDto = paginatedResult.data.map(
      (student) => new StudentResponseDto(student.toObject())
    );
    return { studentsFromDto, meta: paginatedResult.meta };
  });
};

// Get all pending students (applied for admission)
export const getAllPendingStudentsService = async (
  school_uid: string,
  page: number,
  limit: number
): Promise<{ studentsFromDto: StudentResponseDto[]; meta: any }> => {
  if (!school_uid) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      staticProps.common.DATA_REQUIRED
    );
  }

  const cacheKey = generateCacheKey(
    "pending_students",
    school_uid,
    undefined,
    page,
    limit
  );
  return cacheDatabaseQuery(cacheKey, 3600, async () => {
    const StudentModel = await getStudentModel(school_uid);
    const paginatedResult = await paginate(
      StudentModel.find({ status: ENUM_STUDENT_STATUS.PENDING }),
      { page, limit }
    );
    const studentsFromDto = paginatedResult.data.map(
      (student) => new StudentResponseDto(student.toObject())
    );
    return { studentsFromDto, meta: paginatedResult.meta };
  });
};

// Get a student by ID
export const getStudentByIdService = async (
  school_uid: string | undefined,
  studentId: string | undefined
): Promise<StudentResponseDto> => {
  if (!studentId || !school_uid) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      staticProps.common.DATA_REQUIRED
    );
  }

  const cacheKey = generateCacheKey("student", school_uid, studentId);
  return cacheDatabaseQuery(cacheKey, 3600, async () => {
    const StudentModel = await getStudentModel(school_uid);
    const student = await StudentModel.findById(studentId);
    if (!student) {
      throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
    }
    return new StudentResponseDto(student);
  });
};

// Update a student by ID
export const updateStudentByIdService = async (
  studentId: string | undefined,
  data: IStudentUpdate,
  single: IUploadFile[] | undefined
): Promise<StudentResponseDto> => {
  if (!studentId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Student ID is required.");
  }

  // Handle file upload if necessary
  if (single) {
    try {
      const { filePath } = await uploadFiles(single);

      // If there's an existing image, remove it from storage
      if (data.image) {
        removeFile(data.image);
      }

      // Update image path or use default image if not provided
      data.image = filePath || staticProps.default.DEFAULT_IMAGE_PATH;
    } catch (error) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to upload file."
      );
    }
  }

  // Validate the input data
  const validatedData = validateZodSchema(data, StudentUpdateDtoZodSchema);

  if (!validatedData.school_uid) {
    throw new ApiError(httpStatus.BAD_REQUEST, "School UID is required.");
  }

  // Get the student model
  const StudentModel = await getStudentModel(validatedData.school_uid);

  // Find the student by ID
  const student = await StudentModel.findById(studentId);
  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, "Student not found.");
  }

  // Update the student in the database
  const updatedStudent = await StudentModel.findOneAndUpdate(
    { _id: studentId },
    { $set: validatedData },
    { new: true, runValidators: true }
  );

  if (!updatedStudent) {
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to update student.");
  }

  // Create the cache key
  const cacheKey = generateCacheKey(
    "student",
    validatedData.school_uid,
    studentId
  );

  // Invalidate the previous cache (if any) and set the new cache
  await deleteCache(cacheKey);
  const updatedStudentDto = new StudentResponseDto(updatedStudent);

  // Set updated data in cache (with a TTL of 1 hour)
  await setCache(cacheKey, updatedStudentDto, 3600);

  // Invalidate the student list cache (if needed)
  await clearCacheByPattern(
    `students:${validatedData.school_uid}:page:*:limit:*`
  );

  // Invalidate the pending students list cache (if needed)
  await clearCacheByPattern(
    `pending_students:${validatedData.school_uid}:page:*:limit:*`
  );

  // Return the updated student DTO
  return updatedStudentDto;
};

// Delete a student by ID
export const deleteStudentByIdService = async (
  school_uid: string,
  studentId: string | undefined
): Promise<any> => {
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

  // Invalidate the cache for this student
  const cacheKey = generateCacheKey("student", school_uid, studentId);
  await deleteCache(cacheKey);

  // Invalidate list caches if necessary (e.g., "students" or "pending_students")
  await clearCacheByPattern(`students:${school_uid}:page:*:limit:*`);
  await clearCacheByPattern(`pending_students:${school_uid}:page:*:limit:*`);

  return result;
};
