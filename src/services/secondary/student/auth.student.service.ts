import httpStatus from "http-status";
import {
  IStudentCreate,
  IStudentSignIn,
  IUploadFile,
} from "../../../interfaces";
import {
  clearCacheByPattern,
  uploadFiles,
  validateZodSchema,
} from "../../../cores";
import { ApiError, setCache, getCache } from "../../../cores";
import { StudentResponseDto } from "../../../dtos";
import { getStudentModel } from "../../../models";
import { hashString, compareString, generateJwtToken } from "../../../cores";
import {
  ENUM_SCHOOL_ROLES,
  ENUM_STUDENT_STATUS,
  staticProps,
} from "../../../utils";
import {
  StudentLoginDtoZodSchema,
  StudentSignupDtoZodSchema,
} from "../../../validations";

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

// Sign Up Student Service
export const signUpStudentService = async (
  studentData: IStudentCreate,
  file: IUploadFile[] | undefined
) => {
  // Add default role and status
  studentData.role = ENUM_SCHOOL_ROLES.STUDENT;
  studentData.status = ENUM_STUDENT_STATUS.PENDING;

  // Hash the password
  studentData.password = await hashString(studentData.password!);

  // Add default image
  studentData.image = staticProps.default.DEFAULT_IMAGE_PATH;

  // Upload file if exists
  if (file) {
    const { filePath } = await uploadFiles(file);
    if (filePath) {
      studentData.image = filePath;
    }
  }

  // Validate the student data
  const validatedData = validateZodSchema(
    studentData,
    StudentSignupDtoZodSchema
  );

  // TODO: Check if the school exists to avoid creating a student for a non-existing school

  // Get the Student model
  const StudentModel = await getStudentModel(validatedData.school_uid);

  // Create the student in the database
  const student = await StudentModel.create(validatedData);
  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_CREATED);
  }

  // Cache the student data in Redis (with TTL of 1 hour)
  const cacheKey = generateCacheKey(
    "student",
    validatedData.school_uid,
    student._id.toString()
  );
  await setCache(cacheKey, new StudentResponseDto(student), 3600); // 1 hour TTL

  // Invalidate the student list cache (if needed)
  await clearCacheByPattern(
    `students:${validatedData.school_uid}:page:*:limit:*`
  );

  // Invalidate the pending students list cache (if needed)
  await clearCacheByPattern(
    `pending_students:${validatedData.school_uid}:page:*:limit:*`
  );

  return new StudentResponseDto(student);
};

// Sign In Student Service
export const signInStudentService = async (studentData: IStudentSignIn) => {
  // Validate the student data
  const validatedData = validateZodSchema(
    studentData,
    StudentLoginDtoZodSchema
  );

  // Get the Student model
  const StudentModel = await getStudentModel(validatedData.school_uid);

  // First, check Redis for the student (by username)
  const cachedStudent = await getCache<StudentResponseDto>(
    `student:${validatedData.school_uid}:${validatedData.username}`
  );

  if (cachedStudent) {
    // If the student is cached, return cached response along with JWT token
    const token = generateJwtToken({
      _id: cachedStudent._id,
      username: cachedStudent.username,
      role: cachedStudent.role,
    });
    return { token, student: cachedStudent };
  }

  // Find the student in the database if not in the cache
  const student = await StudentModel.findOne({
    username: validatedData.username,
  });

  if (!student) {
    throw new ApiError(httpStatus.UNAUTHORIZED, staticProps.common.NOT_FOUND);
  }

  // Validate the password
  const isPasswordMatch = await compareString(
    studentData.password,
    student.password
  );
  if (!isPasswordMatch) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      staticProps.common.INVALID_CREDENTIALS
    );
  }

  // Generate JWT token
  const jwtPayload = {
    _id: student._id,
    username: student.username,
    role: student.role,
  };
  const token = generateJwtToken(jwtPayload);

  // Cache the student data in Redis for future requests (with TTL of 1 hour)
  const cacheKey = generateCacheKey(
    "student",
    validatedData.school_uid,
    student._id.toString()
  );

  await setCache(cacheKey, new StudentResponseDto(student), 3600); // Cache with TTL of 1 hour

  // Format the response using DTO
  const studentFromDto = new StudentResponseDto(student);
  return { token, student: studentFromDto };
};
