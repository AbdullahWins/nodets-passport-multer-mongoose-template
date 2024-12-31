// src/cores/jwt/jwt.core.ts
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { environment } from "../../configs";
import { IJwtPayload } from "../../interfaces";

export const generateJwtToken = (data: IJwtPayload): string => {
  const payload = {
    _id: data._id.toString(),
    username: data.username,
    role: data.role,
  };

  // token generating
  const token = jwt.sign(
    payload,
    environment.jwt.JWT_ACCESS_TOKEN_SECRET as Secret,
    {
      expiresIn: environment.jwt.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    }
  );

  return token;
};

export const verifyJwtToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};
