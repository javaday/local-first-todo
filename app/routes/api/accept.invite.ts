import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { ActionFunctionArgs } from "react-router";
import { MemberModel, StaffModel } from "~/data/models";
import { InvitationType } from "~/data/models/enums";
import { InvitationModel, InviteAcceptResult } from "~/data/models/invitation.model";
import { getInvitation, updateInvitation } from "~/services/data/invitations.service";
import { addMember, getMemberByEmail, getNextMemberNumber, updateMember } from "~/services/data/members.service";
import { addStaff, updateStaff } from "~/services/data/staff.service";
import { toError } from "~/utils/error.utils";
import { toUUID } from "~/utils/uuid.utils";

dayjs.extend(utc);

export async function action({ request }: ActionFunctionArgs) {

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
		const invitation = await getInvitation(id);

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

			// Add a member if necessary
			let existingMember = await getMemberByEmail(email);

			if (existingMember) {
				if (existingMember.name !== name) {
					existingMember.splitName(name);

					existingMember = await updateMember(existingMember);
				}
			}
			else {
				const nextNumber = await getNextMemberNumber();

				existingMember = new MemberModel({
					email,
					name,
					number: nextNumber
				});

				existingMember.splitName(name);

				existingMember = await addMember(existingMember);
			}

			if (invitation.type === InvitationType.Organization) {

				const memberStaff = existingMember.staff.find(s => s.organizationId === invitation.organizationId);

				if (memberStaff) {
					if (memberStaff.role !== invitation.role) {
						await updateStaff(new StaffModel({
							...memberStaff,
							role: invitation.role
						}));
					}
				}
				else {
					await addStaff(new StaffModel({
						organizationId: invitation.organizationId,
						memberId: existingMember.id,
						role: invitation.role,
						isActive: true
					}));
				}
			}

			// update the invitation
			await updateInvitation(new InvitationModel({
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

		// TODO: Log error

		result.valid = false;
		result.error = error.message;

		return new Response(JSON.stringify(result), {
			headers: { 'Content-Type': 'application/json' }
		});
	}
};