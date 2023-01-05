import express, { Router } from "express";

const router: Router = express.Router();

//Import Controller
import {
	retrieveAllTransactions,
	retrieveMyTransactions,
	transactionDetails,
	transactionDetailsAdmin,
	transferFunds,
	verifyTransaction,
} from "src/controllers/transaction";

//Import middleware
import { logger } from "../middlewares/logger.middleware";
import {
	requireSignin,
	isVerified,
	isAdmin,
} from "../middlewares/auth.middleware";

router.post("/transaction/verify", requireSignin, verifyTransaction);

router.put("/transaction/transfer", requireSignin, isVerified, transferFunds);

router.get("/transactions", requireSignin, isAdmin, retrieveAllTransactions);
router.get("/transaction/:id", requireSignin, isAdmin, transactionDetailsAdmin);
router.get(
	"/transaction/me/:id",
	requireSignin,
	isVerified,
	transactionDetails
);
router.get(
	"/transactions/me",
	requireSignin,
	isVerified,
	retrieveMyTransactions
);

logger({
	allowed: ["status", "host", "method", "protocol", "path"],
	log: process.env.NODE_ENV !== "production",
	// format: "[STATUS] [METHOD] [PATH] [TIME]",
});

export default router;
