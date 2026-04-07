import { Resend } from "resend";
import dotenv from "dotenv";
import { VerificationEmail } from "../emails/VerificationEmail.js";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

class MailService {
	async sendActivationMail(to: string, link: string, username: string) {
		await resend.emails.send({
			from: "noreply@mecener.online",
			to,
			subject: "Mecware account activation",
			react: <VerificationEmail link={link} username={username} />,
		});
	}
}

export default new MailService();
