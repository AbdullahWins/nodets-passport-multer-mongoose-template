// src/dtos/admin/admin.zod.ts
import { z } from "zod";

// Base Admin DTO schema with all properties
const BaseAdminDtoZodSchema = z.object({
  school_uid: z.string().min(1),
  name: z.string().min(1),
  email: z.string().min(1).email(),
  image: z.string().min(5),
  password: z.string().min(6),
  role: z.string().min(1),
  assigned_schools: z.array(z.string().min(1)),
});

// Admin Signup DTO schema
export const AdminSignupDtoZodSchema = BaseAdminDtoZodSchema.pick({
  school_uid: true,
  name: true,
  email: true,
  image: true,
  password: true,
  role: true,
  assigned_schools: true,
});

// Admin Login DTO schema
export const AdminLoginDtoZodSchema = BaseAdminDtoZodSchema.pick({
  school_uid: true,
  email: true,
  password: true,
});

// Entity Update DTO schema
export const AdminUpdateDtoZodSchema = BaseAdminDtoZodSchema.partial().extend({
  school_uid: z.string().min(1),
});
