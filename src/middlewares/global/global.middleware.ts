//src/middlewares/global/global.middleware.ts
import express from "express";
import { Application } from "express";
import helmet from "helmet";
import sanitize from "express-mongo-sanitize";
import { corsConfig, limiterConfig } from "../../configs";
import { multerConfig } from "../../configs/multer/multer.config";
import { parseJsonBodyMiddleware } from "../parse/parse.middleware";
import { promClientMiddleware } from "../monitor/monitor.middleware";
import { requestLoggerMiddleware } from "../logger/logger.middleware";

export const globalMiddleware = (app: Application) => {
  //security middleware
  app.use(corsConfig);
  app.use(sanitize());
  app.use(helmet());
  app.use(limiterConfig);

  //performance middleware
  app.use(requestLoggerMiddleware);

  //add body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  //multer middleware for handling multipart/form-data (both files and text)
  app.use(multerConfig);

  //custom JSON parsing middleware
  app.use(parseJsonBodyMiddleware);

  //prometheus metrics middleware
  app.use(promClientMiddleware);
};
