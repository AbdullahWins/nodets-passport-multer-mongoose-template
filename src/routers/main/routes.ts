//src/routers/main/routes.ts
import express, { Router } from "express";
import {
  AuthRouter,
  AdminRouter,
  SchoolRouter,
  EntityRouter,
  StudentRouter,
  TeacherRouter,
  HeadTeacherRouter,
  SchoolAdminRouter,
} from "..";

export const apiRouter = express.Router();

const apiRoutes: { path: string; route: Router }[] = [
  {
    path: "/auth",
    route: AuthRouter,
  },
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
  {
    path: "/teachers",
    route: TeacherRouter,
  },
  {
    path: "/head-teachers",
    route: HeadTeacherRouter,
  },
  {
    path: "/school-admins",
    route: SchoolAdminRouter,
  },
];

apiRoutes.forEach((route) => apiRouter.use(route.path, route.route));
