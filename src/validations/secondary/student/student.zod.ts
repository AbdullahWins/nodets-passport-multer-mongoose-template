// src/dtos/student/student.zod.ts
import { z } from "zod";

// Base Student DTO schema with all properties
const BaseStudentDtoZodSchema = z.object({
  school_uid: z.string().min(1),
  student_name: z.string().min(1),
  student_email: z.string().min(1).email(),
  student_image: z.string().min(1),
  student_address: z.string().min(1),
  student_password: z.string().min(1),
  student_isEmailVerified: z.boolean(),
  student_role: z.string().min(1),
});

// Student Signup DTO schema
export const StudentSignupDtoZodSchema = BaseStudentDtoZodSchema.pick({
  school_uid: true,
  student_name: true,
  student_email: true,
  student_image: true,
  student_address: true,
  student_password: true,
  student_role: true,
});

// Student Login DTO schema
export const StudentLoginDtoZodSchema = BaseStudentDtoZodSchema.pick({
  school_uid: true,
  student_email: true,
  student_password: true,
});

// Student Update DTO schema
export const StudentUpdateDtoZodSchema =
  BaseStudentDtoZodSchema.partial().extend({
    school_uid: z.string().min(1),
  });
