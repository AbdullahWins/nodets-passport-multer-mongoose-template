// src/interfaces/auth/auth.interface.ts
import { Document } from "mongoose";
import { ENUM_ADMIN_ROLES, ENUM_USER_ROLES } from "../../../utils";
import { IUser } from "../../user/user.interface";
import { IAdmin } from "../../admin/admin.interface";

// Combined Role type
export type Role = ENUM_ADMIN_ROLES | ENUM_USER_ROLES;

// Mongoose document types
export type UserDocument = Document & IUser;
export type AdminDocument = Document & IAdmin;

// Type for accessing user (User, Admin, Store)
export type AccessingUserType = UserDocument | AdminDocument;
