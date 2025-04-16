import { type ActionFunctionArgs } from "react-router";
import { InvitationType, Role } from "~/data/models/enums";
import { InvitationModel } from "~/data/models/invitation.model";
import { DataService } from "~/services/data/DataService";
import { EmailService } from "~/services/email/EmailService";
import { TemplateName } from "~/services/email/templates";
import { toError } from "~/utils/error.utils";
import { toShort } from "~/utils/uuid.utils";

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export async function action({ request }: ActionFunctionArgs) {

	const dataService = DataService.getInstance();
	const emailService = EmailService.getInstance();
	const fromEmail = process.env.EMAIL_FROM_ADDRESS || "";
	const expireDays = parseInt(process.env.APP_INVITATION_EXPIRE_DAYS || "7");

	try {
		const formData = await request.formData();
		const token = formData.get('token')?.valueOf().toString() || '';
		const email = formData.get('email')?.valueOf().toString() || '';
		const listId = formData.get('listId')?.valueOf().toString() || '';

		if (!token || !email || !listId) {
			throw new Error('Required parameters are missing.');
		}

		const admin = await dataService.getMemberByToken(token);

		if (!admin || admin.role !== Role.SystemAdmin) {
			throw new Error('Unauthorized');
		}

		const user = await dataService.getUser({ email });

		if (!user) {
			throw new Error(`The email does not match a registered user.`);
		}

		const list = await dataService.getList(listId);

		if (!list) {
			throw new Error(`The list could not be found.`);
		}

		const invitation = new InvitationModel({
			type: InvitationType.List,
			listId: list.id,
			email
		});

		//1. generate an accept link with a short id
		const shortId = toShort(invitation.id);
		const link = `${process.env.APP_DOMAIN}/accept/${shortId}`;

		// 2. send an email
		const emailId = await emailService.sendEmail(invitation.email, `${process.env.APP_TITLE} List Invitation`, TemplateName.AppInvitation, {
			to: invitation.email,
			from: {
				firstName: process.env.APP_DOMAIN,
				lastName: 'Team',
				email: fromEmail
			},
			listName: list.name,
			acceptLink: link
		});

		if (emailId) {
			const today = dayjs().utc();

			invitation.sentAt = today.unix();
			invitation.sentBy = admin.id;
			invitation.expiresAt = today.add(expireDays, 'day').unix();

			await dataService.addInvitation(invitation);

			return new Response(JSON.stringify({ email, sent: true, error: '' }), {
				headers: { 'Content-Type': 'application/json' },
			});
		}

	}
	catch (err) {

		const error = toError(err);
		console.error(error);

		return new Response(JSON.stringify({ sent: false, error: error.message }), {
			headers: { 'Content-Type': 'application/json' },
			status: 500,
		});
	}
}