import { assert } from "@acdh-oeaw/lib";
import { createTransport, type SendMailOptions, type SentMessageInfo } from "nodemailer";

import { subjectPrefix } from "@/config/email.config";
import { env } from "@/config/env.config";

interface SendEmailParams
	extends Pick<SendMailOptions, "attachments" | "from" | "subject" | "text"> {}

export function sendEmail(params: SendEmailParams): Promise<SentMessageInfo> {
	const { attachments, from, subject, text } = params;

	assert(env.EMAIL_SMTP_SERVER, "Invalid email configuration.");
	assert(env.EMAIL_SMTP_PORT, "Invalid email configuration.");
	assert(env.EMAIL_ADDRESS, "Invalid email configuration.");

	const transporter = createTransport({
		host: env.EMAIL_SMTP_SERVER,
		port: env.EMAIL_SMTP_PORT,
		secure: false,
		auth:
			env.EMAIL_SMTP_USERNAME != null && env.EMAIL_SMTP_PASSWORD != null
				? {
						user: env.EMAIL_SMTP_USERNAME,
						pass: env.EMAIL_SMTP_PASSWORD,
					}
				: undefined,
	});

	return transporter.sendMail({
		from,
		to: env.EMAIL_ADDRESS,
		subject: [subjectPrefix, subject].join(" "),
		text,
		attachments,
	});
}
