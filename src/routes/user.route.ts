import express, { Router } from "express";

const router: Router = express.Router();

//Import Controller
import { profiles } from "../controllers/user";

//Import middleware
import { logger } from "../middlewares/logger.middleware";

router.get("/user/all", profiles);

logger({
	allowed: ["status", "host", "method", "protocol", "path"],
	log: process.env.NODE_ENV !== "production",
	// format: "[STATUS] [METHOD] [PATH] [TIME]",
});

export default router;
