export = Paystack;

declare function Paystack(secret_key: string): Paystack.Object;

declare namespace Paystack {
	interface Object {
		customer: {
			create: (params: {
				first_name: string;
				last_name: string;
				email: string;
				phone: string;
				metadata?: any;
			}) => Promise<Response>;

			get: (id: number | string) => Promise<Response>;

			list: () => Promise<
				Response & { data?: any[] | undefined; meta?: any }
			>;

			update: (
				id: number | string,
				params: {
					first_name: string;
					last_name: string;
					email: string;
					phone: string;
				}
			) => Promise<Response>;
		};

		misc: {
			list_banks: (params: {
				perPage: number;
				page: number;
			}) => Promise<Response & { data: any[] }>;

			resolve_bin: (bin: string) => Promise<Response>;
		};

		page: {
			create: (params: {
				name: string;
				description?: string | undefined;
				amount: number;
				[key: string]: any;
			}) => Promise<Response>;

			get: (id_or_slug: number | string) => Promise<Response>;

			list: () => Promise<Response>;

			update: (
				id_or_slug: number,
				params: {
					name?: string | undefined;
					description?: string | undefined;
					amount?: number | undefined;
					active?: boolean | undefined;
				}
			) => Promise<Response>;

			slug: (slug: string) => Promise<Response & { data: undefined }>;
		};

		plan: {
			create: (params: {
				name: string;
				amount: number;
				interval: string;
				[key: string]: any;
			}) => Promise<Response>;

			get: (id: number | string) => Promise<Response>;

			update: (id: number | string, params: any) => Promise<Response>;

			list: () => Promise<Response>;
		};

		subscription: {
			create: (params: {
				customer: string;
				plan: string;
				authorization: string;
				start_date?: Date | undefined;
			}) => Promise<Response>;

			disable: (params: {
				code: string;
				token: string;
			}) => Promise<Response & { data: undefined }>;

			enable: (params: {
				code: string;
				token: string;
			}) => Promise<Response & { data: undefined }>;

			get: (id_or_subscription_code: string) => Promise<Response>;

			list: () => Promise<Response & { data: any[]; meta: any }>;
		};

		subaccount: {
			create: (params: {
				business_name: string;
				settlement_bank: string;
				account_number: string;
				percentage_charge: number;
			}) => Promise<Response>;

			get: (id_or_slug: number | string) => Promise<Response>;

			list: (param?: any) => Promise<Response>;

			update: (
				id_or_slug: number | string,
				params: any
			) => Promise<Response>;
		};

		transaction: {
			charge: (params: {
				reference: string;
				authorization_code: string;
				email: string;
				amount: number;
			}) => Promise<Response>;

			get: (id: number | string) => Promise<Response>;

			initialize: (params: {
				amount: number;
				reference: string;
				name: string;
				email: string;
				callback_url: string;
				[key: string]: any;
			}) => Promise<Response>;

			list: () => Promise<
				Response & { data?: any[] | undefined; meta?: any }
			>;

			totals: () => Promise<Response>;

			verify: ({ reference }: { reference: string }) => Promise<Response>;
		};
	}

	// Transactions initialization success object
	interface Response {
		status: boolean;
		message: string;
		data?: any;
		[others: string]: any;
	}
}
