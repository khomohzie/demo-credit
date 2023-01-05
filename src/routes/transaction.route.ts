import express, { Router } from "express";

const router: Router = express.Router();

//Import Controller
import verifyTransaction from "../controllers/transaction/transaction.controller";

//Import middleware
import { logger } from "../middlewares/logger.middleware";
import { requireSignin, isVerified } from "../middlewares/auth.middleware";

router.post("/transaction/verify", requireSignin, verifyTransaction);

logger({
	allowed: ["status", "host", "method", "protocol", "path"],
	log: process.env.NODE_ENV !== "production",
	// format: "[STATUS] [METHOD] [PATH] [TIME]",
});

export default router;
