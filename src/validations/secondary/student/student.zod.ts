// src/dtos/student/student.zod.ts
// src/dtos/student/student.zod.ts
import { z } from "zod";

// Base Student DTO schema with all properties
const BaseStudentDtoZodSchema = z.object({
  school_uid: z.string().min(1),
  username: z.string().min(1),
  name_english: z.string().min(1),
  name_bangla: z.string().min(1),
  mobile_number: z.string().min(1),
  gender: z.string().min(1),
  date_of_birth: z.string().min(1),
  birth_certificate_number: z.string().min(1),
  email: z.string().min(1).email(),
  nationality: z.string().min(1),
  religion: z.string().min(1),
  blood_group: z.string().min(1),
  disability: z.string().min(1),
  password: z.string().min(1),
  image: z.string().min(1),
  father_name_english: z.string().min(1),
  father_name_bangla: z.string().min(1),
  father_mobile_number: z.string().min(1),
  father_nid_number: z.string().min(1),
  father_profession: z.string().min(1),
  mother_name_english: z.string().min(1),
  mother_name_bangla: z.string().min(1),
  mother_mobile_number: z.string().min(1),
  mother_nid_number: z.string().min(1),
  mother_profession: z.string().min(1),
  present_address_line: z.string().min(1),
  present_address_district: z.string().min(1),
  present_address_upozilla: z.string().min(1),
  present_address_post_office: z.string().min(1),
  present_address_post_code: z.string().min(1),
  permanent_address_line: z.string().min(1),
  permanent_address_district: z.string().min(1),
  permanent_address_upozilla: z.string().min(1),
  permanent_address_post_office: z.string().min(1),
  permanent_address_post_code: z.string().min(1),
  role: z.string().min(1),
});

// Student Signup DTO schema
export const StudentSignupDtoZodSchema = BaseStudentDtoZodSchema.pick({
  school_uid: true,
  username: true,
  name_english: true,
  name_bangla: true,
  mobile_number: true,
  gender: true,
  date_of_birth: true,
  birth_certificate_number: true,
  email: true,
  nationality: true,
  religion: true,
  blood_group: true,
  disability: true,
  password: true,
  image: true,
  father_name_english: true,
  father_name_bangla: true,
  father_mobile_number: true,
  father_nid_number: true,
  father_profession: true,
  mother_name_english: true,
  mother_name_bangla: true,
  mother_mobile_number: true,
  mother_nid_number: true,
  mother_profession: true,
  present_address_line: true,
  present_address_district: true,
  present_address_upozilla: true,
  present_address_post_office: true,
  present_address_post_code: true,
  permanent_address_line: true,
  permanent_address_district: true,
  permanent_address_upozilla: true,
  permanent_address_post_office: true,
  permanent_address_post_code: true,
});

// Student Login DTO schema
export const StudentLoginDtoZodSchema = BaseStudentDtoZodSchema.pick({
  school_uid: true,
  username: true,
  password: true,
});

// Student Update DTO schema
export const StudentUpdateDtoZodSchema =
  BaseStudentDtoZodSchema.partial().extend({
    school_uid: z.string().min(1),
    role: z.string().min(1),
  });
