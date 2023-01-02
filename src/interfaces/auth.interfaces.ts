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
	firstname: string;
	lastname: string;
	email: string;
	password: string;
	research_id?: string;
	age?: number;
	gender?: string;
	institution?: string;
	faculty?: string;
	department?: string;
	level?: number;
	bio?: string;
	avatar: string;
	cover_photo: string;
	contact?: string;
	role: {
		type: string;
		id: number;
		enum: Array<string | number>;
	};
	reset_password_pin: string;
	reset_pin_expiry?: Date;
	active: boolean;
	verified: boolean;
}
