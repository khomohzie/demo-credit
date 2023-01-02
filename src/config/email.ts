import template from "../utils/mail-template.util";

const transporter = (
	email: string,
	subject: string,
	content: string,
	signature?: string
) => {
	const htmlTemplate = template.default(subject, content, signature);

	return new Promise((resolve, reject) => {
		//
	});
};

export default transporter;
