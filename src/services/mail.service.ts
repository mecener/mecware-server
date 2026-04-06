import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

class MailService {
	async sendActivationMail(to: string, link: string) {
		await resend.emails.send({
			from: "onboarding@resend.dev",
			to,
			subject: "Активация аккаунта Mecware",
			html: `
				<div>
					<h1>Для активации перейдите по ссылке ниже</h1>
					<a href="${link}">${link}</a>
				</div>
			`,
		});
	}
}

export default new MailService();
