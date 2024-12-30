//src/routers/schoolAdmin/schoolAdmin.router.ts
import express from "express";
const router = express.Router();

// middleware
import { authenticateEntity, authorizeEntity } from "../../../middlewares";

// enum
import { ENUM_AUTH_ROLES } from "../../../utils";

// controllers
import {
  GetAllSchoolAdmins,
  GetSchoolAdminById,
  SignUpSchoolAdmin,
  SignInSchoolAdmin,
  UpdateSchoolAdminById,
  DeleteSchoolAdminById,
} from "../../../controllers";

//routes
router.get(
  "/all",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN, ENUM_AUTH_ROLES.STAFF_ADMIN]),
  GetAllSchoolAdmins
);
router.get(
  "/find/:schoolAdminId",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN, ENUM_AUTH_ROLES.STAFF_ADMIN]),
  GetSchoolAdminById
);
router.post(
  "/add",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN, ENUM_AUTH_ROLES.STAFF_ADMIN]),
  SignUpSchoolAdmin
);
router.post("/login", SignInSchoolAdmin);
router.patch(
  "/update/:schoolAdminId",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN, ENUM_AUTH_ROLES.STAFF_ADMIN]),
  UpdateSchoolAdminById
);
router.delete(
  "/delete/:schoolAdminId",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN, ENUM_AUTH_ROLES.STAFF_ADMIN]),
  DeleteSchoolAdminById
);

export const SchoolAdminRouter = router;
