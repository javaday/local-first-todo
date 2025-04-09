import { render } from '@react-email/render';
import { Resend } from 'resend';
import { AbstractEmailService } from './abstract.service';

import { useEmailTemplate } from './EmailTemplate';
import { TemplateName } from './templates';

export class ResendEmailService extends AbstractEmailService {

	private resend: Resend;

	constructor() {
		super();
		this.resend = new Resend(process.env.RESEND_API_KEY);
	}

	public sendEmail = async (to: string, subject: string, template: TemplateName, params: any) => {

		try {
			const jsx = useEmailTemplate(template, params);
			const html = await render(jsx, {
				pretty: true
			});
			const text = await render(jsx, {
				plainText: true
			});

			const { data, error } = await this.resend.emails.send({
				from: `${process.env.APP_TITLE}<${this.fromAddress}>`,
				to,
				subject,
				react: jsx,
				text,
			});

			if (error) {
				return null;
			}

			if (data) {
				return data.id;
			}
		}
		catch (error) {
			console.error('Error sending email:', error);
		}

		return null;
	}
}
