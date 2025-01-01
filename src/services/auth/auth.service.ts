import httpStatus from "http-status";
import { ApiError } from "../../cores";
import { IUploadFile } from "../../interfaces";
import {
  signInSchoolAdminService,
  signInStudentService,
  signInTeacherService,
  signUpSchoolAdminService,
  signUpStudentService,
  signUpTeacherService,
} from "../secondary";
import { ENUM_SCHOOL_ROLES, staticProps } from "../../utils";

export const signUpEntityService = async (
  schoolEntityData: any,
  file: IUploadFile[] | undefined
) => {
  const { entity_type } = schoolEntityData;
  let entity = null;

  //try to create entity on student
  if (entity_type === ENUM_SCHOOL_ROLES.STUDENT) {
    entity = await signUpStudentService(schoolEntityData, file);
  } else if (
    entity_type === ENUM_SCHOOL_ROLES.TEACHER ||
    entity_type === ENUM_SCHOOL_ROLES.HEAD_TEACHER
  ) {
    entity = await signUpTeacherService(schoolEntityData, file);
  } else if (entity_type === ENUM_SCHOOL_ROLES.SCHOOL_ADMIN) {
    entity = await signUpSchoolAdminService(schoolEntityData);
  }

  if (!entity) {
    throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_CREATED);
  }

  return entity;
};

export const signInEntityService = async (schoolEntityData: any) => {
  const { entity_type } = schoolEntityData;
  let entity = null;

  //try to signin entity
  if (entity_type === ENUM_SCHOOL_ROLES.STUDENT) {
    entity = await signInStudentService(schoolEntityData);
  } else if (
    entity_type === ENUM_SCHOOL_ROLES.TEACHER ||
    entity_type === ENUM_SCHOOL_ROLES.HEAD_TEACHER
  ) {
    entity = await signInTeacherService(schoolEntityData);
  } else if (entity_type === ENUM_SCHOOL_ROLES.SCHOOL_ADMIN) {
    entity = await signInSchoolAdminService(schoolEntityData);
  }

  if (!entity) {
    throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
  }

  return entity;
};
