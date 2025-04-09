import { type ActionFunctionArgs } from "react-router";
import { InvitationModel } from "~/data/models/invitation.model";
import { db } from "~/services/data/instant.server";
import { addInvitation } from "~/services/data/invitations.service";
import { EmailService } from "~/services/email/EmailService";
import { TemplateName } from "~/services/email/templates";
import { toError } from "~/utils/error.utils";
import { toShort } from "~/utils/uuid.utils";

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { InvitationType, Role } from "~/data/models/enums";
import { getMemberByToken } from "~/services/data/members.service";

dayjs.extend(utc);

export async function action({ request }: ActionFunctionArgs) {

	const emailService = EmailService.getInstance();
	const fromEmail = process.env.EMAIL_FROM_ADDRESS || "";
	const expireDays = parseInt(process.env.APP_INVITATION_EXPIRE_DAYS || "7");

	try {
		const formData = await request.formData();
		const token = formData.get('token')?.valueOf().toString() || '';
		const email = formData.get('email')?.valueOf().toString() || '';

		if (!token || !email) {
			throw new Error('Required parameters are missing.');
		}

		const admin = await getMemberByToken(token);

		if (!admin || admin.role !== Role.SystemAdmin) {
			throw new Error('Unauthorized');
		}

		const user = await db.auth.getUser({ email });

		if (user) {
			throw new Error(`The email is already registered.`);
		}
		else {
			const invitation = new InvitationModel({
				type: InvitationType.App,
				email
			});

			//1. generate an accept link with a short id
			const shortId = toShort(invitation.id);
			const link = `${process.env.APP_DOMAIN}/accept/${shortId}`;

			// 2. send an email
			const emailId = await emailService.sendEmail(invitation.email, `${process.env.APP_TITLE} Invitation`, TemplateName.AppInvitation, {
				to: invitation.email,
				from: {
					firstName: process.env.APP_DOMAIN,
					lastName: 'Team',
					email: fromEmail
				},
				acceptLink: link
			});

			if (emailId) {
				const today = dayjs().utc();

				invitation.sentAt = today.unix();
				invitation.sentBy = admin.id;
				invitation.expiresAt = today.add(expireDays, 'day').unix();

				await addInvitation(invitation);

				return new Response(JSON.stringify({ sent: true, error: '' }), {
					headers: { 'Content-Type': 'application/json' },
				});
			}
		}
	}
	catch (err) {

		const error = toError(err);

		return new Response(JSON.stringify({ sent: false, error: error.message }), {
			headers: { 'Content-Type': 'application/json' },
			status: 500,
		});
	}
}