//src/routers/student/student.router.ts
import express from "express";
const router = express.Router();

// middleware
import { authorizeEntity, authenticateEntity } from "../../../middlewares";

// enum
import { ENUM_AUTH_ROLES } from "../../../utils";

// controllers
import {
  GetAllStudents,
  GetStudentById,
  SignUpStudent,
  SignInStudent,
  UpdateStudentById,
  DeleteStudentById,
} from "../../../controllers";

//routes
router.get(
  "/all",
  authenticateEntity,
  authorizeEntity([
    ENUM_AUTH_ROLES.SUPER_ADMIN,
    ENUM_AUTH_ROLES.NORMAL_ADMIN,
    ENUM_AUTH_ROLES.STORE_ADMIN,
  ]),
  GetAllStudents
);
router.get(
  "/find/:studentId",
  authenticateEntity,
  authorizeEntity([
    ENUM_AUTH_ROLES.SUPER_ADMIN,
    ENUM_AUTH_ROLES.NORMAL_ADMIN,
    ENUM_AUTH_ROLES.STORE_ADMIN,
  ]),
  GetStudentById
);
router.post(
  "/add",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN, ENUM_AUTH_ROLES.NORMAL_ADMIN]),
  SignUpStudent
);
router.post("/login", SignInStudent);
router.patch(
  "/update/:studentId",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN, ENUM_AUTH_ROLES.NORMAL_ADMIN]),
  UpdateStudentById
);
router.delete(
  "/delete/:studentId",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN, ENUM_AUTH_ROLES.NORMAL_ADMIN]),
  DeleteStudentById
);

export const StudentRouter = router;
