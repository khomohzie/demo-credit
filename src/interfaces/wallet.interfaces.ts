export interface IWallet {
	id: number;
	user_id: number;
	wallet_tag: string;
	account_number: string;
	pin: string;
	balance: number;
	debt: number;
	created_at: string;
	updated_at: string;
	deleted_at?: string;
}
