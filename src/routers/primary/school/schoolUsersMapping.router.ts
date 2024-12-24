//src/routers/schoolUsersMapping/schoolUsersMapping.router.ts
import express from "express";
const router = express.Router();

// middleware
import { authorizeEntity, authenticateEntity } from "../../../middlewares";

// enum
import { ENUM_AUTH_ROLES } from "../../../utils";

// controllers
import {
  GetAllSchoolUsersMappings,
  GetSchoolUsersMappingById,
  AddOneSchoolUsersMapping,
  UpdateSchoolUsersMappingById,
  DeleteSchoolUsersMappingById,
} from "../../../controllers";

//routes
router.get(
  "/all",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN, ENUM_AUTH_ROLES.NORMAL_USER]),
  GetAllSchoolUsersMappings
);
router.get(
  "/find/:schoolUsersMappingId",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN, ENUM_AUTH_ROLES.NORMAL_ADMIN]),
  GetSchoolUsersMappingById
);
router.post(
  "/add",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN, ENUM_AUTH_ROLES.NORMAL_ADMIN]),
  AddOneSchoolUsersMapping
);
router.patch(
  "/update/:schoolUsersMappingId",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN, ENUM_AUTH_ROLES.NORMAL_ADMIN]),
  UpdateSchoolUsersMappingById
);
router.delete(
  "/delete/:schoolUsersMappingId",
  authenticateEntity,
  authorizeEntity([ENUM_AUTH_ROLES.SUPER_ADMIN, ENUM_AUTH_ROLES.NORMAL_ADMIN]),
  DeleteSchoolUsersMappingById
);

export const SchoolUsersMappingRouter = router;
