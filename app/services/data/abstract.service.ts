import { User } from "@instantdb/admin";
import { InvitationModel } from "~/data/models/invitation.model";
import { ListModel } from "~/data/models/list.model";
import { MemberModel } from "~/data/models/member.model";


export interface IDataService {
	getUser(params: { id: string } | { email: string } | { refresh_token: string }): Promise<User | null>;
	getMemberByEmail(email: string): Promise<MemberModel | null>;
	getMemberByToken(token: string): Promise<MemberModel | null>;
	registerMember(email: string, name: string, sentBy: string): Promise<MemberModel | null>;
	getInvitation(id: string): Promise<InvitationModel | null>;
	getNewInvitations(): Promise<InvitationModel[]>;
	addInvitation(invitation: InvitationModel): Promise<InvitationModel>;
	updateInvitation(invitation: InvitationModel): Promise<InvitationModel>;
	getList(id: string): Promise<ListModel | null>;
}

export abstract class AbstractDataService implements IDataService {

	constructor() { }

	async getUser(params: { id: string } | { email: string } | { refresh_token: string }): Promise<User | null> {
		return null;
	}

	async getMemberByToken(token: string): Promise<MemberModel | null> {
		return null;
	};

	async getMemberByEmail(email: string): Promise<MemberModel | null> {
		return null;
	}

	async registerMember(email: string, name: string, sentBy: string): Promise<MemberModel | null> {
		return null;
	}

	async getNewInvitations(): Promise<InvitationModel[]> {
		return [];
	}

	async getInvitation(id: string): Promise<InvitationModel | null> {
		return null;
	}

	async addInvitation(model: InvitationModel): Promise<InvitationModel> {
		return model;
	}

	async updateInvitation(model: InvitationModel): Promise<InvitationModel> {
		return model;
	}

	async getList(id: string): Promise<ListModel | null> {
		return null;
	}
}