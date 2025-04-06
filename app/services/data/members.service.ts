import { id, tx } from "@instantdb/admin";
import { MemberModel } from "~/data/models/member.model";
import { db } from './instant.server';

import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(dayOfYear);

const getMemberByToken = async (token: string) => {

	const user = await db.auth.verifyToken(token);

	if (user) {
		return getMemberByEmail(user.email);
	}
	else {
		return null;
	}
};

const getMemberByEmail = async (email: string): Promise<MemberModel | null> => {

	try {
		const data = await db.query({
			members: {
				$: {
					where: {
						email
					},
				},
			},
		});

		const { members } = data;

		if (Array.isArray(members) && members.length > 0) {
			const model = members[0];
			return new MemberModel(model);
		}

		return null;
	}
	catch (err) {
		// TODO: Log error
		console.log(err);
		return null;
	}
}

const registerMember = async (adminId: string, organizationId: string, email: string) => {

	const today = dayjs().utc();

	const member = await getMemberByEmail(email);

	if (member) {
		// Make sure the member is linked to the organization
		const memberData = member.getData();
		const batch = [
			tx.members[memberData.id]
				.link({
					organization: organizationId
				})
		];

		await db.transact(batch);

		return member;
	}
	else {
		// Create user if necessary
		const token = await db.auth.createToken(email);
		const user = await db.auth.getUser({ refresh_token: token });

		// Create member record
		const memberData = {
			id: id(),
			userId: user.id,
			organizationId: organizationId,
			email: email,
			isDeleted: false,
			createdAt: today.unix(),
			createdBy: adminId
		};

		const batch = [
			tx.members[memberData.id]
				.update(memberData)
				.link({
					user: user.id,
					organization: organizationId
				})
		];

		await db.transact(batch);

		return getMemberByEmail(email);
	}
}

export {
	getMemberByEmail,
	getMemberByToken,
	registerMember
};

