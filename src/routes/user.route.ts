import express, { Router } from "express";

const router: Router = express.Router();

//Import Controller
import { profiles, aUserData, userProfile } from "../controllers/user";

//Import middleware
import { logger } from "../middlewares/logger.middleware";
import { requireSignin, isAdmin } from "../middlewares/auth.middleware";

router.get("/user/all", requireSignin, isAdmin, profiles);
router.get("/user/data/:id", requireSignin, isAdmin, aUserData);

router.get("/user/me", requireSignin, userProfile);

logger({
	allowed: ["status", "host", "method", "protocol", "path"],
	log: process.env.NODE_ENV !== "production",
	// format: "[STATUS] [METHOD] [PATH] [TIME]",
});

export default router;
