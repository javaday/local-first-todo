import { AuditModel } from "./audit.model";

export interface InvitationSendResult {
	invitation: InvitationModel | null;
	error: string;
}

export interface InviteAcceptResult {
	token: string;
	registered: boolean;
	valid: boolean;
	expired: boolean;
	error: string | null;
}

export class InvitationModel extends AuditModel {

	listId: string = '';
	email: string = '';
	sentBy: string = '';
	sentAt: number = 0;
	expiresAt: number = 0;
	acceptedAt: number = 0;

	getData() {
		const auditData = super.getData();
		return {
			listId: this.listId,
			email: this.email,
			sentBy: this.sentBy,
			sentAt: this.sentAt,
			expiresAt: this.expiresAt,
			acceptedAt: this.acceptedAt,
			...auditData
		}
	}

	constructor(data: any = {}) {
		super(data);
		this.listId = data.listId || '';
		this.email = data.email || '';
		this.sentBy = data.sentBy || '';
		this.sentAt = data.sentAt || 0;
		this.expiresAt = data.expiresAt || 0;
		this.acceptedAt = data.acceptedAt || 0;
	}
}