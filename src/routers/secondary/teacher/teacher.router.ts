//src/routers/teacher/teacher.router.ts
import express from "express";
const router = express.Router();

// middleware
import { authenticateEntity, authorizeEntity } from "../../../middlewares";

// enum
import { ENUM_AUTH_ROLES } from "../../../utils";

// controllers
import {
  GetAllTeachers,
  GetTeacherById,
  SignUpTeacher,
  SignInTeacher,
  UpdateTeacherById,
  DeleteTeacherById,
} from "../../../controllers";

//routes
router.get(
  "/all",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN, ENUM_AUTH_ROLES.STAFF_ADMIN]),
  GetAllTeachers
);
router.get(
  "/find/:teacherId",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN, ENUM_AUTH_ROLES.STAFF_ADMIN]),
  GetTeacherById
);
router.post(
  "/add",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN, ENUM_AUTH_ROLES.STAFF_ADMIN]),
  SignUpTeacher
);
router.post("/login", SignInTeacher);
router.patch(
  "/update/:teacherId",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN, ENUM_AUTH_ROLES.STAFF_ADMIN]),
  UpdateTeacherById
);
router.delete(
  "/delete/:teacherId",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN, ENUM_AUTH_ROLES.STAFF_ADMIN]),
  DeleteTeacherById
);

export const TeacherRouter = router;
