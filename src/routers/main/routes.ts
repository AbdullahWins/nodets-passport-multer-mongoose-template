//src/routers/main/routes.ts
import express, { Router } from "express";
import {
  AdminRouter,
  GameRouter,
  ProductRouter,
  StoreRouter,
  TicketRouter,
  UserRouter,
  SchoolUsersMappingRouter,
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
    path: "/stores",
    route: StoreRouter,
  },
  {
    path: "/games",
    route: GameRouter,
  },
  {
    path: "/products",
    route: ProductRouter,
  },
  {
    path: "/tickets",
    route: TicketRouter,
  },
  {
    path: "/school-users-mapping",
    route: SchoolUsersMappingRouter,
  },
];

apiRoutes.forEach((route) => apiRouter.use(route.path, route.route));
