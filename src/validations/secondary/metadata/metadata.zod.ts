// src/dtos/school/school.zod.ts
import { z } from "zod";

// Base School DTO schema with all properties
const BaseSchoolMetadataDtoZodSchema = z.object({
  school_uid: z.string().min(1),
  school_name: z.string().min(1),
  school_db_name: z.string().min(1),
});

// School Login DTO schema
export const SchoolMetadataAddDtoZodSchema =
  BaseSchoolMetadataDtoZodSchema.pick({
    school_uid: true,
    school_name: true,
    school_db_name: true,
  });

// School Update DTO schema
export const SchoolMetadataUpdateDtoZodSchema =
  BaseSchoolMetadataDtoZodSchema.partial().extend({
    school_uid: z.string().min(1),
  });
