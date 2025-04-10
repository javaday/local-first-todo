import { tx } from "@instantdb/admin";
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

const registerMember = async (email: string, name: string, sentBy: string) => {

	const today = dayjs().utc();

	// Create user if necessary
	const token = await db.auth.createToken(email);
	const user = await db.auth.getUser({ refresh_token: token });

	// Create member record
	const newMember = new MemberModel({
		id: user.id,
		email,
		createdAt: today.unix(),
		createdBy: sentBy
	});

	newMember.splitName(name);

	const memberData = newMember.getData();

	const batch = [
		tx.members[memberData.id]
			.update(memberData)
			.link({
				user: user.id,
			})
	];

	await db.transact(batch);

	return getMemberByEmail(email);
}

export {
	getMemberByEmail,
	getMemberByToken,
	registerMember
};

