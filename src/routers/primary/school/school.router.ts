//src/routers/school/school.router.ts
import express from "express";
const router = express.Router();

// middleware
import { authorizeEntity, authenticateEntity } from "../../../middlewares";

// enum
import { ENUM_AUTH_ROLES } from "../../../utils";

// controllers
import {
  GetAllSchools,
  GetSchoolById,
  AddOneSchool,
  UpdateSchoolById,
  DeleteSchoolById,
} from "../../../controllers";

//routes
router.get(
  "/all",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN, ENUM_AUTH_ROLES.STAFF_ADMIN]),
  GetAllSchools
);
router.get(
  "/find/:schoolId",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN, ENUM_AUTH_ROLES.STAFF_ADMIN]),
  GetSchoolById
);
router.post(
  "/add",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN, ENUM_AUTH_ROLES.STAFF_ADMIN]),
  AddOneSchool
);
router.patch(
  "/update/:schoolId",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN, ENUM_AUTH_ROLES.STAFF_ADMIN]),
  UpdateSchoolById
);
router.delete(
  "/delete/:schoolId",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN, ENUM_AUTH_ROLES.STAFF_ADMIN]),
  DeleteSchoolById
);

export const SchoolRouter = router;
