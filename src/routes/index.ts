import { Router } from "express";
import { default as scrawny } from "scrawny";
import { default as dummyRoute } from "./dummy.route";

const router: Router = require("express").Router();

router.use(
	"",
	scrawny({
		log: true,
	}),
	dummyRoute
);

export default router;
