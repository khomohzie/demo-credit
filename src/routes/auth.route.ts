import express, { Router } from "express";

const router: Router = express.Router();

//Import Controller
import {
	signup,
	login,
	// logout,
	// sendEmail,
	// verifyEmail,
	// refresh,
	// forgot,
	// reset,
	// googlefacebooklogin,
} from "../controllers/auth";

import { validate } from "../middlewares/validate.middleware";
// import { requireSignin } from "../middlewares/auth.middleware";

import { createUserSchema, loginUserSchema } from "@validator/user.validator";

router.post("/auth/signup", validate(createUserSchema), signup);
router.post("/auth/login", validate(loginUserSchema), login);

// router.post("/auth/logout", requireSignin, logout);

// router.post("/auth/resend", sendEmail);
// router.put("/auth/verify", verifyEmail);
// router.get("/auth/refresh", refresh);

//Import middleware
import { logger } from "../middlewares/logger.middleware";

logger({
	allowed: ["status", "host", "method", "protocol", "path"],
	log: process.env.NODE_ENV !== "production",
	// format: "[STATUS] [METHOD] [PATH] [TIME]",
});

export default router;
