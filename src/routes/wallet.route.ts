import express, { Router } from "express";

const router: Router = express.Router();

//Import Controller
import {
	createWallet,
	retrieveMyWallet,
	changeWalletPin,
} from "../controllers/wallet";

//Import middleware
import { logger } from "../middlewares/logger.middleware";
import { requireSignin, isVerified } from "../middlewares/auth.middleware";

router.post("/wallet/me", requireSignin, createWallet);
router.get("/wallet/me", requireSignin, isVerified, retrieveMyWallet);

// Security routes
router.put("/wallet/me", requireSignin, isVerified, changeWalletPin);

logger({
	allowed: ["status", "host", "method", "protocol", "path"],
	log: process.env.NODE_ENV !== "production",
	// format: "[STATUS] [METHOD] [PATH] [TIME]",
});

export default router;
