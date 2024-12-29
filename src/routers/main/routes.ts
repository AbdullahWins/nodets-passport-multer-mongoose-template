//src/routers/main/routes.ts
import express, { Router } from "express";
import {
  SchoolRouter,
  StudentRouter,
  EntityRouter,
  AdminRouter,
} from "..";

export const apiRouter = express.Router();

const apiRoutes: { path: string; route: Router }[] = [
  {
    path: "/admins",
    route: AdminRouter,
  },
  {
    path: "/schools",
    route: SchoolRouter,
  },
  {
    path: "/entities",
    route: EntityRouter,
  },
  {
    path: "/students",
    route: StudentRouter,
  },
];

apiRoutes.forEach((route) => apiRouter.use(route.path, route.route));
