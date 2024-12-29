//src/middlewares/auth/auth.middleware.ts
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import { ENUM_AUTH_ROLES, staticProps } from "../../utils";
import { IJwtPayload } from "../../interfaces";
import { ApiError } from "../../cores";
import { environment } from "../../configs";

// Auth middleware for roles
export const authorizeEntity =
  (roles?: ENUM_AUTH_ROLES[]) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const entity = req.entity as IJwtPayload;

      if (!entity) {
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          staticProps.jwt.INVALID_TOKEN
        );
      }

      // Check if the role is allowed
      const allowedRoles = roles ?? Object.values(ENUM_AUTH_ROLES);

      if (!allowedRoles.includes(entity.role as ENUM_AUTH_ROLES)) {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          `Forbidden: Required roles '${allowedRoles.join(", ")}' but found '${
            entity.role
          }'`
        );
      }

      // Attach entity to request object if needed
      req.entity = entity;
      next();
    } catch (error) {
      next(error);
    }
  };

// Auth middleware to authenticate the entity using JWT
export const authenticateEntity = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      message: staticProps.jwt.INVALID_TOKEN,
      error: "Unauthorized",
    });
  }

  try {
    // Verify the JWT token and decode the payload
    const decoded = jwt.verify(
      token,
      environment.jwt.JWT_ACCESS_TOKEN_SECRET
    ) as IJwtPayload;

    // Attach the entity to the request object
    req.entity = decoded;

    return next();
  } catch (err) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      message: staticProps.jwt.INVALID_TOKEN,
      error: "Unauthorized",
    });
  }
};
