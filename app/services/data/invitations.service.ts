import { tx } from "@instantdb/admin";
import { InvitationModel } from "~/data/models/invitation.model";
import { db } from './instant.server';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const getNewInvitations = async () => {

	try {
		const data = await db.query({
			invitations: {
				$: {
					where: {
						sentAt: 0,
					},
				},
			},
		});

		const { invitations } = data;

		if (Array.isArray(invitations)) {
			return invitations.map(model => new InvitationModel(model));
		}

		return [];
	}
	catch (err) {
		return [];
	}
}

const getInvitation = async (id: string) => {

	try {
		const data = await db.query({
			invitations: {
				$: {
					where: {
						id
					},
				},
			},
		});

		const { invitations } = data;

		if (Array.isArray(invitations) && invitations.length > 0) {
			const model = invitations[0];
			return new InvitationModel(model);
		}

		return null;
	}
	catch (err) {
		return null;
	}
}

const updateInvitation = async (model: InvitationModel) => {

	try {
		const data = model.getData();

		data.updatedAt = dayjs().utc().unix();
		data.updatedBy = 'system';

		await db.transact([
			tx.invitations[data.id]
				.update(data)
		]);

		model = new InvitationModel(data);
	}
	catch (err) {
		console.log(err)
	}

	return model;
}

export {
	getInvitation,
	getNewInvitations,
	updateInvitation
};
