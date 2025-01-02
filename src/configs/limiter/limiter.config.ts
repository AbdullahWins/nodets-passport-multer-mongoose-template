import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import httpStatus from "http-status";
import { ApiError } from "../../cores";
import { staticProps } from "../../utils";

// Rate limiting middleware (requests per IP)
export const limiterConfig = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 1000, // limit each IP to 1000 request per windowMs
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
