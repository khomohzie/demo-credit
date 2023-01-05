import express, { Router } from "express";

const router: Router = express.Router();

//Import Controller
import { transferFunds, verifyTransaction } from "src/controllers/transaction";

//Import middleware
import { logger } from "../middlewares/logger.middleware";
import { requireSignin, isVerified } from "../middlewares/auth.middleware";

router.post("/transaction/verify", requireSignin, verifyTransaction);

router.put("/transaction/transfer", requireSignin, isVerified, transferFunds);

logger({
	allowed: ["status", "host", "method", "protocol", "path"],
	log: process.env.NODE_ENV !== "production",
	// format: "[STATUS] [METHOD] [PATH] [TIME]",
});

export default router;
