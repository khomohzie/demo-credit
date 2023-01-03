const tableNames = {
	transaction: "transaction",
	wallet: "wallet",
	user: "user",
};

const orderedTableNames: Array<string> = [
	tableNames.transaction,
	tableNames.wallet,
	tableNames.user,
];

export { tableNames, orderedTableNames };
