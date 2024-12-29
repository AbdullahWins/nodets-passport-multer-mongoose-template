//src/routers/auth/auth.router.ts
import express from "express";
const router = express.Router();

import { CentralSignin, CentralSignup } from "../../controllers";

// controllers

//routes
router.post("/signin", CentralSignin);
router.post("/signup", CentralSignup);

export const AuthRouter = router;
