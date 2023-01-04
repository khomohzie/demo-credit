const tableNames = {
	transaction: "transaction",
	wallet: "wallet",
	user: "user",
	reference: "reference",
};

const orderedTableNames: Array<string> = [
	tableNames.transaction,
	tableNames.reference,
	tableNames.wallet,
	tableNames.user,
];

export { tableNames, orderedTableNames };
