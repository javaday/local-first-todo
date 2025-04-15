import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { ActionFunctionArgs } from "react-router";
import { InvitationType } from "~/data/models/enums";
import { InvitationModel, InviteAcceptResult } from "~/data/models/invitation.model";
import { DataService } from '~/services/data/DataService';
import { toError } from "~/utils/error.utils";
import { toUUID } from "~/utils/uuid.utils";

dayjs.extend(utc);

export async function action({ request }: ActionFunctionArgs) {

	const dataService = DataService.getInstance();
	const result: InviteAcceptResult = {
		token: '',
		registered: false,
		valid: true,
		expired: false,
		error: null
	};

	try {
		const formData = await request.formData();
		const token = formData.get('token')?.valueOf().toString() || '';
		const email = formData.get('email')?.valueOf().toString() || '';
		const name = formData.get('name')?.valueOf().toString() || '';

		if (!token) {
			throw new Error('An invitation token is required.');
		}

		if (!email) {
			throw new Error('An email is required.');
		}

		if (!name) {
			throw new Error('A name is required.');
		}

		result.token = token;

		const id = toUUID(token);
		const invitation = await dataService.getInvitation(id);

		if (invitation) {

			const today = dayjs().utc();

			if (invitation.email.toLowerCase() !== email.toLowerCase()) {
				throw new Error('The submitted email address does not match the invitation.');
			}

			if (invitation.acceptedAt > 0) {
				throw new Error('This invitation has already been accepted.');
			}

			if (invitation.expiresAt <= today.unix()) {
				result.expired = true;
				throw new Error('This invitation is expired.');
			}

			const newMember = await dataService.registerMember(email, name, invitation.sentBy);

			if (invitation.type === InvitationType.List) {
				// Link to list
			}

			// update the invitation
			await dataService.updateInvitation(new InvitationModel({
				...invitation,
				acceptedAt: dayjs().utc().unix()
			}));

			result.registered = true;

			return new Response(JSON.stringify(result), {
				headers: { 'Content-Type': 'application/json' }
			});
		}
		else {
			throw new Error('The invitation record was not found.');
		}
	}
	catch (err) {
		const error = toError(err);

		result.valid = false;
		result.error = error.message;

		return new Response(JSON.stringify(result), {
			headers: { 'Content-Type': 'application/json' }
		});
	}
};