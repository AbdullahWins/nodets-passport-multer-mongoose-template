import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import httpStatus from "http-status";
import { ApiError } from "../../cores";
import { staticProps } from "../../utils";

// Rate limiting middleware (requests per IP)
export const limiterConfig = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 1, // limit each IP to 1 request per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, _res: Response, _next: NextFunction) => {
    // Create a new ApiError instance
    throw new ApiError(
      httpStatus.TOO_MANY_REQUESTS,
      staticProps.common.LIMIT_EXCEEDED
    );
  },
});
