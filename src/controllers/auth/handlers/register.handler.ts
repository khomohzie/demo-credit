import { NextFunction, Request, Response } from "express";
import User from "../../../models/user.model";
import { CreateUserInput } from "@validator/user.validator";
import CustomException from "@utils/handlers/error.handler";
import { encrypt } from "@utils/auth.util";
import CustomResponse from "@utils/handlers/response.handler";
import otp from "@utils/methods.util";
import transporter from "@config/email";

const signup = async (
	req: Request<{}, {}, CreateUserInput>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { email, firstname, lastname, password } = req.body;

		const userExists = await User.query().where({ email: email }).first();

		if (userExists) {
			return next(new CustomException(400, "Email already taken!"));
		}

		const hashedPassword = await encrypt.password(password);

		// Prepare verification mail variables
		const verifyToken = await otp.create(email.toLowerCase(), 4, 600);

		const msg = `Use this code to verify your Demo Credit account. It expires in 10 minutes.
			<h1 class="code block text-5xl text-center font-bold tracking-wide my-10">${verifyToken}</h1>
			<p class="text-xs my-1 text-center">If you did not request this email, kindly ignore it or reach out to support if you think your account is at risk.</p>
		`;

		const user = await User.query().insert({
			email,
			firstname,
			lastname,
			password: hashedPassword,
		});

		if (user) {
			await transporter(
				email,
				"Demo Credit account - Email verification",
				msg
			)
				.then((data: any) => {
					return new CustomResponse(res).success(
						`A verification code has been sent to ${email}`,
						{},
						200,
						data
					);
				})
				.catch((err: any) => {
					return new CustomResponse(res).success(
						"Failed to send verification email. Login and verify later.",
						{},
						200,
						err
					);
				});
		} else {
			throw new Error("Failed to create account. Please try again");
		}
	} catch (error) {
		console.log(error);
		return next(error);
	}
};

export default signup;
