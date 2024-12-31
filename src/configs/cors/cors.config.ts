import cors, { CorsOptions } from "cors";
import { ApiError, errorLogger, infoLogger } from "../../cores";
import { staticProps } from "../../utils";

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = ["http://localhost:3000"];

    if (!origin) {
      infoLogger.info(
        `${staticProps.cors.CORS_ALLOWED_FOR_ORIGIN}: undefined (non-browser request)`
      );
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      infoLogger.info(`${staticProps.cors.CORS_ALLOWED_FOR_ORIGIN}: ${origin}`);
      return callback(null, true);
    } else {
      errorLogger.error(
        `${staticProps.cors.CORS_BLOCKED_FOR_ORIGIN}: ${origin}`
      );
      return callback(new ApiError(403, staticProps.cors.CORS_BLOCKED));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

export const corsConfig = cors(corsOptions);
