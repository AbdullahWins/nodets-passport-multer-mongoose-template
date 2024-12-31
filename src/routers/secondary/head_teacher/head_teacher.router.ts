//src/routers/headTeacher/headTeacher.router.ts
import express from "express";
const router = express.Router();

// middleware
import { authenticateEntity, authorizeEntity } from "../../../middlewares";

// enum
import { ENUM_AUTH_ROLES } from "../../../utils";

// controllers
import {
  GetAllHeadTeachers,
  GetHeadTeacherById,
  SignUpHeadTeacher,
  SignInHeadTeacher,
  UpdateHeadTeacherById,
  DeleteHeadTeacherById,
} from "../../../controllers";

//routes
router.get(
  "/all",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN, ENUM_AUTH_ROLES.STAFF_ADMIN]),
  GetAllHeadTeachers
);
router.get(
  "/find/:headTeacherId",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN, ENUM_AUTH_ROLES.STAFF_ADMIN]),
  GetHeadTeacherById
);
router.post(
  "/add",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN, ENUM_AUTH_ROLES.STAFF_ADMIN]),
  SignUpHeadTeacher
);
router.post("/login", SignInHeadTeacher);
router.patch(
  "/update/:headTeacherId",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN, ENUM_AUTH_ROLES.STAFF_ADMIN]),
  UpdateHeadTeacherById
);
router.delete(
  "/delete/:headTeacherId",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN, ENUM_AUTH_ROLES.STAFF_ADMIN]),
  DeleteHeadTeacherById
);

export const HeadTeacherRouter = router;
