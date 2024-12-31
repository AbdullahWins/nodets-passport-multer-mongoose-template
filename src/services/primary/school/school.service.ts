import httpStatus from "http-status";
import { SchoolResponseDto } from "../../../dtos";
import { ApiError, uploadFiles } from "../../../cores";
import { ENUM_SCHOOL_ROLES, paginate, staticProps } from "../../../utils";
import { School } from "../../../models";
import {
  signUpSchoolAdminService,
  createSchoolMetadata,
} from "../../../services";

// Get all schools with pagination
export const getAllSchoolsService = async (page: number, limit: number) => {
  const paginatedResult = await paginate(School.find(), { page, limit });

  const schoolsFromDto = paginatedResult.data.map(
    (school) => new SchoolResponseDto(school.toObject())
  );

  return { schoolsFromDto, meta: paginatedResult.meta };
};

// Get a school by ID
export const getSchoolByIdService = async (schoolId: string | undefined) => {
  const school = await School.findById(schoolId);
  if (!school) {
    throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
  }

  return new SchoolResponseDto(school);
};

// Add a new school
export const addSchoolService = async (schoolData: any, file: any) => {
  const { school_uid, school_name } = schoolData;

  // Upload file if provided
  let school_image = staticProps.default.DEFAULT_IMAGE_PATH;
  if (file) {
    const { filePath } = await uploadFiles(file);
    school_image = filePath || school_image;
  }

  const school_db_name = `school_${school_uid.toLowerCase()}`;
  const constructedData = {
    ...schoolData,
    school_image,
    school_db_name,
  };

  // Insert into the primary database
  const school = await School.create(constructedData);
  if (!school) {
    throw new ApiError(httpStatus.BAD_REQUEST, staticProps.common.NOT_CREATED);
  }

  // Create metadata and admin for the school
  const schoolAdminData = {
    school_uid,
    name: "School Admin",
    username: "admin",
    password: "admin",
    mobile_number: "none",
    role: ENUM_SCHOOL_ROLES.SCHOOL_ADMIN,
  };
  const schoolMetadata = {
    school_uid,
    school_name,
    school_db_name,
  };

  await signUpSchoolAdminService(schoolAdminData);
  await createSchoolMetadata(schoolMetadata);

  return new SchoolResponseDto(school);
};

// Update a school by ID
export const updateSchoolByIdService = async (
  schoolId: string | undefined,
  schoolData: any
) => {
  const school = await School.findByIdAndUpdate(
    schoolId,
    { $set: schoolData },
    { new: true, runValidators: true }
  );

  if (!school) {
    throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
  }

  return new SchoolResponseDto(school);
};

// Delete a school by ID
export const deleteSchoolByIdService = async (schoolId: string | undefined) => {
  const result = await School.deleteOne({ _id: schoolId });

  if (result.deletedCount === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
  }
};
