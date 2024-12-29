import httpStatus from "http-status";
import { IAdminCreate, IAdminSignin, IUploadFile } from "../../../interfaces";
import { uploadFiles, validateZodSchema } from "../../../cores";
import { ApiError } from "../../../cores";
import { AdminResponseDto } from "../../../dtos";
import { hashString, compareString, generateJwtToken } from "../../../cores";
import { ENUM_ADMIN_ROLES, staticProps } from "../../../utils";
import {
  AdminLoginDtoZodSchema,
  AdminSignupDtoZodSchema,
} from "../../../validations";
import { Admin } from "../../../models";

export const signUpAdminService = async (
  adminData: IAdminCreate,
  file: IUploadFile[] | undefined
) => {
  //add default role
  adminData.role = ENUM_ADMIN_ROLES.STAFF_ADMIN;

  //add default school_uid and assigned_schools
  adminData.school_uid = staticProps.default.DEFAULT_SUPER_ADMIN;
  adminData.assigned_schools = [staticProps.default.DEFAULT_SUPER_ADMIN];

  // Hash the password
  adminData.password = await hashString(adminData.password!);

  // Add default image
  adminData.image = staticProps.default.DEFAULT_IMAGE_PATH;

  // Upload file if exists
  if (file) {
    const { filePath } = await uploadFiles(file);
    console.log("filePath", filePath);
    if (filePath) {
      adminData.image = filePath;
    }
  }
  console.log("adminData", adminData);

  //validate the admin data
  const validatedData = validateZodSchema(adminData, AdminSignupDtoZodSchema);
  console.log("validatedData", validatedData);

  // Create the admin
  const admin = await Admin.create(validatedData);
  if (!admin) {
    throw new ApiError(httpStatus.NOT_FOUND, staticProps.common.NOT_CREATED);
  }

  return new AdminResponseDto(admin);
};

export const signInAdminService = async (adminData: IAdminSignin) => {
  //validate the admin data
  const validatedData = validateZodSchema(adminData, AdminLoginDtoZodSchema);

  // Find the admin by email
  const admin = await Admin.findOne({
    email: validatedData.email,
  });

  if (!admin) {
    throw new ApiError(httpStatus.UNAUTHORIZED, staticProps.common.NOT_FOUND);
  }

  // Validate the password
  const isPasswordMatch = await compareString(
    adminData.password,
    admin.password
  );
  if (!isPasswordMatch) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      staticProps.common.INVALID_CREDENTIALS
    );
  }

  // Generate JWT token
  const jwtPayload = {
    _id: admin._id,
    email: admin.email,
    role: admin.role,
  };
  const token = generateJwtToken(jwtPayload);

  // use dto to format the admin response
  const adminFromDto = new AdminResponseDto(admin);
  const result = { token, admin: adminFromDto };

  return result;
};
