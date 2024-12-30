//src/routers/student/student.router.ts
import express from "express";
const router = express.Router();

// middleware
import { authenticateEntity, authorizeEntity } from "../../../middlewares";

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
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN, ENUM_AUTH_ROLES.STAFF_ADMIN]),
  GetAllStudents
);
router.get(
  "/find/:studentId",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN, ENUM_AUTH_ROLES.STAFF_ADMIN]),
  GetStudentById
);
router.post(
  "/add",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN, ENUM_AUTH_ROLES.STAFF_ADMIN]),
  SignUpStudent
);
router.post("/login", SignInStudent);
router.patch(
  "/update/:studentId",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN, ENUM_AUTH_ROLES.STAFF_ADMIN]),
  UpdateStudentById
);
router.delete(
  "/delete/:studentId",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN, ENUM_AUTH_ROLES.STAFF_ADMIN]),
  DeleteStudentById
);

export const StudentRouter = router;
