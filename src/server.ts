import http from "http";

// Load environment variables from .env file
require("dotenv").config();

// Import the modules necessary for clusters/multiple instances.
const cluster = require("cluster");
const num_processes = require("os").cpus().length;

import net from "net";
import farmhash from "farmhash";

// Load express
import app from "./app";

import { PeerServer } from "peer";
import redisClient from "./utils/redis.util";

const PORT: number = process.env.PORT || 8080;

// Connect to MySQL database

// Connect to REDIS
redisClient
	.connect()
	.then(() => {
		if (process.env.NODE_ENV !== "test") {
			console.log("🛠\tRedis - Connection open");
		}
	})
	.catch((err: any) => {
		console.log(err);
	});

app.listen(PORT, "0.0.0.0", () => {
	console.log(`SERVER LISTENING ON PORT ${PORT}`);
});
