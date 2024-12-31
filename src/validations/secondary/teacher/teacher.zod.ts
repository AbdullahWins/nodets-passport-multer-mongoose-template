// src/dtos/teacher/teacher.zod.ts
import { z } from "zod";

// Base Teacher DTO schema with all properties
const BaseTeacherDtoZodSchema = z.object({
  // Basic Information
  school_uid: z.string().min(1, "School UID is required"),
  teacher_index: z.number().int().min(1, "Teacher Index is required"),
  name: z.string().min(1, "Name is required"),
  username: z.string().min(1, "Username is required"),
  gender: z
    .enum(["Male", "Female", "Other"])
    .refine((val) => val !== undefined, "Gender is required"),
  nid_number: z.string().min(1, "NID Number is required"),
  mobile_number: z.string().min(1, "Mobile Number is required"),
  status: z
    .enum(["active", "inactive"])
    .refine((val) => val !== undefined, "Status is required"),
  contract_type: z
    .enum(["permanent", "temporary"])
    .refine((val) => val !== undefined, "Contract Type is required"),

  // Educational Qualifications
  highest_qualification: z.string().min(1, "Highest Qualification is required"),
  other_qualification: z.string().min(1, "Other Qualification is required"),
  subject_specialization: z
    .string()
    .min(1, "Subject Specialization is required"),

  // Present Address
  present_address_line: z.string().min(1, "Present Address is required"),
  present_district: z.string().min(1, "Present District is required"),
  present_upozilla: z.string().min(1, "Present Upozilla is required"),
  present_post_office: z.string().min(1, "Present Post Office is required"),
  present_post_code: z.string().min(1, "Present Post Code is required"),

  // Permanent Address
  permanent_address_line: z.string().min(1, "Permanent Address is required"),
  permanent_district: z.string().min(1, "Permanent District is required"),
  permanent_upozilla: z.string().min(1, "Permanent Upozilla is required"),
  permanent_post_office: z.string().min(1, "Permanent Post Office is required"),
  permanent_post_code: z.string().min(1, "Permanent Post Code is required"),

  // Other Information
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  tax_identification_number: z
    .string()
    .min(1, "Tax Identification Number is required"),

  // Metadata
  image: z.string().min(1, "Image is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.string().min(1, "Role is required"),
});

// Teacher Signup DTO schema
export const TeacherSignupDtoZodSchema = BaseTeacherDtoZodSchema.pick({
  school_uid: true,
  teacher_index: true,
  username: true,
  name: true,
  gender: true,
  nid_number: true,
  mobile_number: true,
  status: true,
  contract_type: true,
  highest_qualification: true,
  other_qualification: true,
  subject_specialization: true,
  present_address_line: true,
  present_district: true,
  present_upozilla: true,
  present_post_office: true,
  present_post_code: true,
  permanent_address_line: true,
  permanent_district: true,
  permanent_upozilla: true,
  permanent_post_office: true,
  permanent_post_code: true,
  email: true,
  tax_identification_number: true,
  image: true,
  password: true,
  role: true,
});

// Teacher Login DTO schema
export const TeacherLoginDtoZodSchema = BaseTeacherDtoZodSchema.pick({
  school_uid: true,
  username: true,
  password: true,
});

// Teacher Update DTO schema
export const TeacherUpdateDtoZodSchema =
  BaseTeacherDtoZodSchema.partial().extend({
    school_uid: z.string().min(1, "School UID is required"),
  });
