import { Router } from "express";
import { default as scrawny } from "scrawny";
import { default as userRoute } from "./user.route";

const router: Router = require("express").Router();

router.use(
	"",
	scrawny({
		log: true,
	}),
	userRoute
);

export default router;
