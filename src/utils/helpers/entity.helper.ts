//src/utils/helpers/entity.helper.ts
import { ENUM_ADMIN_ROLES } from "../enums";
import mongoose from "mongoose";

//check if the role is admin
export const isEntityAdmin = (role: string) => {
  return Object.values(ENUM_ADMIN_ROLES).includes(role as ENUM_ADMIN_ROLES);
};

//check if accessing user is the owner
export const isEntityOwner = (
  userId: string | mongoose.Types.ObjectId,
  ownerId: string | mongoose.Types.ObjectId
) => {
  return userId.toString() === ownerId.toString();
};

export const isEntityAllowed = (
  role: string,
  userId: string | mongoose.Types.ObjectId,
  ownerId: string | mongoose.Types.ObjectId
) => {
  return isEntityAdmin(role) || isEntityOwner(userId, ownerId);
};
