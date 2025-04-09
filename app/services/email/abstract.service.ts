import { TemplateName } from './templates/index';

export interface IEmailService {
	sendEmail: (to: string, subject: string, template: TemplateName, params: any) => Promise<string | null>;
}

export abstract class AbstractEmailService implements IEmailService {

	protected fromAddress: string;

	constructor() {
		this.fromAddress = `${process.env.EMAIL_FROM_ADDRESS}`;
	}

	public sendEmail = (to: string, subject: string, template: TemplateName, data: any): Promise<string | null> => {
		return Promise.resolve(null);
	}
}
