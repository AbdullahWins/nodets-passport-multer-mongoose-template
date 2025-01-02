//src/types/index.d.ts
import { IJwtPayload, IMulterFiles } from "../interfaces";

declare global {
  namespace Express {
    interface Request {
      entity: IJwtPayload | null | undefined;
      file: any;
      files: any;
      rateLimit: {
        limit: number;
        remaining: number;
        resetTime: number;
      };
    }
  }
}
