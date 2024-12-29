// src/dtos/entity/entity.zod.ts
import { z } from "zod";

// Base Entity DTO schema with all properties
const BaseEntityDtoZodSchema = z.object({
  school_uid: z.string().min(1),
  name: z.string().min(1),
  email: z.string().min(1).email(),
  image: z.string().min(1),
  address: z.string().min(1),
  password: z.string().min(1),
  isEmailVerified: z.boolean(),
  role: z.string().min(1),
});

// Entity Signup DTO schema
export const EntitySignupDtoZodSchema = BaseEntityDtoZodSchema.pick({
  school_uid: true,
  name: true,
  email: true,
  image: true,
  address: true,
  password: true,
  role: true,
});

// Entity Login DTO schema
export const EntityLoginDtoZodSchema = BaseEntityDtoZodSchema.pick({
  school_uid: true,
  email: true,
  password: true,
});

// Entity Update DTO schema
export const EntityUpdateDtoZodSchema = BaseEntityDtoZodSchema.partial().extend(
  {
    school_uid: z.string().min(1),
  }
);
