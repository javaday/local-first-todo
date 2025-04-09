import { IEmailService } from "./abstract.service";
import { ResendEmailService } from "./resend.service";

export class EmailService {

	private static instance: IEmailService;

	private constructor() { }

	public static getInstance(): IEmailService {

		if (!EmailService.instance) {
			switch (process.env.EMAIL_SERVICE) {
				case 'Resend':
					EmailService.instance = new ResendEmailService();
					break;
				default:
					EmailService.instance = new ResendEmailService();
			}
		}

		return EmailService.instance;
	}
}