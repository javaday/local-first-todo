import { init, InstantAdminDatabase, tx, User } from "@instantdb/admin";
import { AppSchema } from "instant.schema";
import { AbstractDataService, IDataService } from "./abstract.service";

import dayjs from 'dayjs';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import utc from 'dayjs/plugin/utc';
import { InvitationModel } from "~/data/models/invitation.model";
import { ListModel } from "~/data/models/list.model";
import { MemberModel } from "~/data/models/member.model";

dayjs.extend(utc);
dayjs.extend(dayOfYear);

export class InstantDataService extends AbstractDataService {

	private static instance: IDataService;
	private db: InstantAdminDatabase<AppSchema>;

	constructor() {
		super();
		this.db = init<AppSchema>({
			appId: process.env.VITE_INSTANT_APP_ID!,
			adminToken: process.env.INSTANT_APP_ADMIN_TOKEN!,
		});
	}

	async getUser(params: { id: string } | { email: string } | { refresh_token: string }): Promise<User> {
		return this.db.auth.getUser(params);
	}

	async getMemberByToken(token: string): Promise<MemberModel | null> {

		const user = await this.db.auth.verifyToken(token);

		if (user) {
			return this.getMemberByEmail(user.email);
		}
		else {
			return null;
		}
	};

	async getMemberByEmail(email: string): Promise<MemberModel | null> {

		try {
			const data = await this.db.query({
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

	async registerMember(email: string, name: string, sentBy: string) {

		const today = dayjs().utc();

		// Create user if necessary
		const token = await this.db.auth.createToken(email);
		const user = await this.db.auth.getUser({ refresh_token: token });

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

		await this.db.transact(batch);

		return this.getMemberByEmail(email);
	}

	async getNewInvitations(): Promise<InvitationModel[]> {

		try {
			const data = await this.db.query({
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

	async getInvitation(id: string): Promise<InvitationModel | null> {

		try {
			const data = await this.db.query({
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

	async addInvitation(model: InvitationModel): Promise<InvitationModel> {

		try {
			const data = model.getData();

			data.createdAt = dayjs().utc().unix();
			data.createdBy = 'system';

			const batch = [
				tx.invitations[data.id]
					.update(data)
			];

			if (data.listId) {
				batch.push(
					tx.invitations[data.id]
						.link({
							list: data.listId
						})
				);
			}

			await this.db.transact(batch);

			model = new InvitationModel(data);
		}
		catch (err) {
			console.log(err)
		}

		return model;
	}

	async updateInvitation(model: InvitationModel): Promise<InvitationModel> {

		try {
			const data = model.getData();

			data.updatedAt = dayjs().utc().unix();
			data.updatedBy = 'system';

			await this.db.transact([
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

	async getList(id: string): Promise<ListModel | null> {

		try {
			const data = await this.db.query({
				lists: {
					$: {
						where: {
							id
						},
					},
				},
			});

			const { lists } = data;

			if (Array.isArray(lists) && lists.length > 0) {
				const model = lists[0];
				return new ListModel(model);
			}

			return null;
		}
		catch (err) {
			return null;
		}
	}
}