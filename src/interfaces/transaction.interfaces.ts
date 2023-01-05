export interface ITransaction {
	id: number;
	sender_id: number;
	transaction_hash: string;
	recipient_id: number;
	recipient_account: string;
	description?: string;
	category: string;
	status: string;
	created_at: string;
	updated_at: string;
	deleted_at?: string;
}

export interface IReference {
	id: number;
	reference_id: string;
	sender_id: number;
	recipient_id: number;
	recipient_account: string;
	amount: number;
	is_successful: boolean;
	created_at: string;
	updated_at: string;
	deleted_at?: string;
}

export interface ITransactionService {
	sender_id: number;
	recipient_id: number;
	recipient_account: string;
	category: string;
	description: string;
	amount: number;
}
