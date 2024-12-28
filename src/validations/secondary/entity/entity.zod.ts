// src/dtos/entity/entity.zod.ts
import { z } from "zod";

// Base Entity DTO schema with all properties
const BaseEntityDtoZodSchema = z.object({
  school_uid: z.string().min(1),
  entity_name: z.string().min(1),
  entity_email: z.string().min(1).email(),
  entity_image: z.string().min(1),
  entity_address: z.string().min(1),
  entity_password: z.string().min(1),
  entity_isEmailVerified: z.boolean(),
  entity_role: z.string().min(1),
});

// Entity Signup DTO schema
export const EntitySignupDtoZodSchema = BaseEntityDtoZodSchema.pick({
  school_uid: true,
  entity_name: true,
  entity_email: true,
  entity_image: true,
  entity_address: true,
  entity_password: true,
  entity_role: true,
});

// Entity Login DTO schema
export const EntityLoginDtoZodSchema = BaseEntityDtoZodSchema.pick({
  school_uid: true,
  entity_email: true,
  entity_password: true,
});

// Entity Update DTO schema
export const EntityUpdateDtoZodSchema = BaseEntityDtoZodSchema.partial().extend(
  {
    school_uid: z.string().min(1),
  }
);
