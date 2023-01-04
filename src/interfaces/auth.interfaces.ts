export interface ISignUpData {
	email: string;
	username: string;
	country: string;
	password: string;
	confirmPassword: string;
}

export interface IPasswordResetData {
	email: string;
	token: string;
	password: string;
	confirmPassword: string;
}

export interface IUser {
	id: number;
	firstname: string;
	lastname: string;
	email: string;
	password: string;
	bvn?: string;
	avatar: string;
	phone_number?: string;
	role: string;
	verified: boolean;
	deleted_at: string;
}
