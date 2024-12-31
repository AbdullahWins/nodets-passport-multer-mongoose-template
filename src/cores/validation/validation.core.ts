// src/cores/validation/validation.core.ts
import { ZodSchema } from "zod";
import httpStatus from "http-status";
import { ApiError } from "../error_handler/error_handler.core";

export const validateZodSchema = <T>(
  data: unknown,
  schema: ZodSchema<T>
): T => {
  const result = schema.safeParse(data);

  if (result.success) {
    return result.data;
  }

  const errorMessages = result.error.errors
    .map((err) => `${err.path.join(".")}: ${err.message}`)
    .join(", ");

  // Throwing a custom ApiError
  throw new ApiError(httpStatus.BAD_REQUEST, errorMessages);
};
