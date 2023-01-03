import User from "../models/user.model";
import CustomException from "../utils/handlers/error.handler";

// Profile Helper module - For updating and inserting profile data

class Account {
	constructor(userId: number) {
		this.userId = userId;

		if (!userId) throw new Error("No user ID provided!");

		// console.log(`Profile initiated - ${this.userId}`);
	}

	userId;

	/* ================ METHODS ================ */

	// CHECK IF A USER EXISTS IN THE DATABASE
	async check() {
		const data = await User.query().where("id", this.userId).first();
		if (data) {
			return true;
		} else {
			return false;
		}
		// return data;
	}

	/**
	 * @returns object
	 * @description Get a user's profile'
	 */
	async findProfile() {
		const data = await User.query().where("id", this.userId).first();
		const check = await this.check();

		// If the user exists
		if (check) {
			return data;
		} else {
			throw { statusCode: 404, message: "User not found" };
		}
	}

	/**
	 * @returns object
	 * @description Get current user's account
	 */
	async findUser() {
		const data = await User.query().findById(this.userId);
		const check = await this.check();

		// If the user exists
		if (check) {
			return data;
		} else {
			throw new CustomException(404, "User not found");
		}
	}
}

export default Account;
