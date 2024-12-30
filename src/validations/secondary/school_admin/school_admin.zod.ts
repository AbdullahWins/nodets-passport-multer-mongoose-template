// src/dtos/schoolAdmin/schoolAdmin.zod.ts
import { z } from "zod";

// Base SchoolAdmin DTO schema with all properties
const BaseSchoolAdminDtoZodSchema = z.object({
  school_uid: z.string().min(1),
  name: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(1),
  mobile_number: z.string().min(1),
  role: z.string().min(1),
});

// SchoolAdmin Signup DTO schema
export const SchoolAdminSignupDtoZodSchema = BaseSchoolAdminDtoZodSchema.pick({
  school_uid: true,
  name: true,
  username: true,
  password: true,
  mobile_number: true,
  role: true,
});

// SchoolAdmin Login DTO schema
export const SchoolAdminLoginDtoZodSchema = BaseSchoolAdminDtoZodSchema.pick({
  school_uid: true,
  username: true,
  password: true,
});

// SchoolAdmin Update DTO schema
export const SchoolAdminUpdateDtoZodSchema =
  BaseSchoolAdminDtoZodSchema.partial().extend({
    school_uid: z.string().min(1),
  });
