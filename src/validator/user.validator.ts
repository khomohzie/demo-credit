import { any, object, string, TypeOf } from "zod";

export const createUserSchema = object({
	body: object({
		email: string({ required_error: "Email is required" }).email(
			"Invalid email"
		),
		firstname: string({ required_error: "Firstname is required" }),
		lastname: string({ required_error: "Lastname is required" }),
		password: string({ required_error: "Password is required" })
			.min(8, "Password must be at least 8 characters")
			.max(32, "Password must be less than 32 characters"),
	}),
});

export const loginUserSchema = object({
	body: object({
		email: string({ required_error: "Email is required" }).email(
			"This is not a valid email address"
		),
		password: string({ required_error: "Password is required" }),
	}),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>["body"];
export type LoginUserInput = TypeOf<typeof loginUserSchema>["body"];
