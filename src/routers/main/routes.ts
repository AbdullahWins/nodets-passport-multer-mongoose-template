//src/routers/main/routes.ts
import express, { Router } from "express";
import { AuthRouter, SchoolRouter, EntityRouter, AdminRouter } from "..";

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
];

apiRoutes.forEach((route) => apiRouter.use(route.path, route.route));
