//src/routers/main/routes.ts
import express, { Router } from "express";
import { AdminRouter, UserRouter, SchoolRouter, GuardianRouter } from "..";

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
    path: "/schools",
    route: SchoolRouter,
  },
  {
    path: "/guardians",
    route: GuardianRouter,
  },
];

apiRoutes.forEach((route) => apiRouter.use(route.path, route.route));
