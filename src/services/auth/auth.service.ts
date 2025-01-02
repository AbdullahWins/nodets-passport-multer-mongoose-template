import httpStatus from "http-status";
import { ApiError, infoLogger } from "../../cores";
import { IUploadFile } from "../../interfaces";
import {
  signInSchoolAdminService,
  signInStudentService,
  signInTeacherService,
  signUpSchoolAdminService,
  signUpStudentService,
  signUpTeacherService,
} from "../secondary";
import { ENUM_AUTH_ROLES, staticProps } from "../../utils";
import { signInAdminService, signUpAdminService } from "../primary";

export const signUpEntityService = async (
  schoolEntityData: any,
  file: IUploadFile[] | undefined
) => {
  const { entity_type } = schoolEntityData;
  let entity = null;

  //try to create entity on student
  if (
    entity_type === ENUM_AUTH_ROLES.SUPER_ADMIN ||
    entity_type === ENUM_AUTH_ROLES.STAFF_ADMIN
  ) {
    entity = await signUpAdminService(schoolEntityData, file);
  } else if (entity_type === ENUM_AUTH_ROLES.STUDENT) {
    entity = await signUpStudentService(schoolEntityData, file);
  } else if (
    entity_type === ENUM_AUTH_ROLES.TEACHER ||
    entity_type === ENUM_AUTH_ROLES.HEAD_TEACHER
  ) {
    entity = await signUpTeacherService(schoolEntityData, file);
  } else if (entity_type === ENUM_AUTH_ROLES.SCHOOL_ADMIN) {
    entity = await signUpSchoolAdminService(schoolEntityData);
  }

  if (!entity) {
    throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_CREATED);
  }

  infoLogger.info(
    `Entity created successfully: ${entity_type} with username: ${schoolEntityData.username} for school: ${schoolEntityData?.school_uid}`
  );

  return entity;
};

export const signInEntityService = async (schoolEntityData: any) => {
  const { entity_type } = schoolEntityData;
  let entity = null;

  //try to signin entity
  if (
    entity_type === ENUM_AUTH_ROLES.SUPER_ADMIN ||
    entity_type === ENUM_AUTH_ROLES.STAFF_ADMIN
  ) {
    entity = await signInAdminService(schoolEntityData);
  } else if (entity_type === ENUM_AUTH_ROLES.STUDENT) {
    entity = await signInStudentService(schoolEntityData);
  } else if (
    entity_type === ENUM_AUTH_ROLES.TEACHER ||
    entity_type === ENUM_AUTH_ROLES.HEAD_TEACHER
  ) {
    entity = await signInTeacherService(schoolEntityData);
  } else if (entity_type === ENUM_AUTH_ROLES.SCHOOL_ADMIN) {
    entity = await signInSchoolAdminService(schoolEntityData);
  }

  if (!entity) {
    throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_FOUND);
  }

  infoLogger.info(
    `Entity logged in successfully: ${entity_type} with username: ${schoolEntityData.username} for school: ${schoolEntityData?.school_uid}`
  );

  return entity;
};
