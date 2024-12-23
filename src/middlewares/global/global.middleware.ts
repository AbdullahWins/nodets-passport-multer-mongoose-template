//src/middlewares/global/global.middleware.ts
import express from "express";
import passport from "passport";
import { Application } from "express";
import helmet from "helmet";
import sanitize from "express-mongo-sanitize";
import { corsConfig } from "../../configs";
import { multerConfig } from "../../configs/multer/multer.config";
import { parseJsonBodyMiddleware } from "../parse/parse.middleware";
import { promClientMiddleware } from "../monitor/monitor.middleware";
import { requestLoggerMiddleware } from "../logger/logger.middleware";
import { configurePassport } from "../../configs/passport/passport.config";

export const globalMiddleware = (app: Application) => {
  app.use(corsConfig);
  app.use(sanitize());
  app.use(helmet());
  app.use(requestLoggerMiddleware);

  // Add body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Multer middleware for handling multipart/form-data (both files and text)
  app.use(multerConfig);

  // Custom JSON parsing middleware
  app.use(parseJsonBodyMiddleware);

  // Prometheus metrics middleware
  app.use(promClientMiddleware);

  // Initialize Passport configuration
  configurePassport();
  app.use(passport.initialize());
};
