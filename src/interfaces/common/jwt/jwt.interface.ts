// src/interfaces/jwt/jwt.interface.ts
import { Types } from "mongoose";

export interface IJwtPayload {
  _id: Types.ObjectId | string;
  username: string;
  role: string;
  isAccessingOwnData?: boolean;
}

