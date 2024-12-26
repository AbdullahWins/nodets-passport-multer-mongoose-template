//src/routers/main/routes.ts
import express, { Router } from "express";
import {
  AdminRouter,
  UserRouter,
  SchoolUsersMappingRouter,
  SchoolRouter,
} from "..";

export const apiRouter = express.Router();

const apiRoutes: { path: string; route: Router }[] = [
  {
    path: "/users",
    route: UserRouter,
  },
  {
    path: "/admins",
    route: AdminRouter,
  },
  {
    path: "/school-users-mapping",
    route: SchoolUsersMappingRouter,
  },
  {
    path: "/schools",
    route: SchoolRouter,
  },
];

apiRoutes.forEach((route) => apiRouter.use(route.path, route.route));
