import { AuditModel } from "./audit.model";
import { Role } from "./enums";
import { ListModel } from "./list.model";

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export class MemberModel extends AuditModel {

	role: string = '';
	email: string = '';
	name: string = '';
	firstName: string = '';
	lastName: string = '';
	avatarUrl: string = '';

	// not db fields
	token: string = '';
	initials: string = '';
	lists: ListModel[] = [];

	splitName = (name: string) => {
		const nameParts = name.split(' ');

		this.firstName = nameParts.shift() || '';
		this.lastName = nameParts.length > 0 ? nameParts.join(' ') : '';
		this.name = name;
	}

	signOut: () => void = () => { };

	getData() {
		const baseData = super.getData();
		return {
			role: this.role,
			email: this.email,
			name: this.name,
			firstName: this.firstName,
			lastName: this.lastName,
			avatarUrl: this.avatarUrl,
			...baseData
		}
	}

	constructor(data: any = {}) {
		super(data);
		this.role = data.role || Role.None;
		this.email = data.email || '';
		this.name = data.name || '';
		this.firstName = data.firstName || '';
		this.lastName = data.lastName || '';
		this.avatarUrl = data.avatarUrl || '';

		this.lists = (data.lists || []).map((l: any) => new ListModel(l));

		const name = `${this.firstName} ${this.lastName}`.trim() || this.name || '';

		if (name.length) {
			const names = name.split(' ')
			const firstInit = names[0].charAt(0).toUpperCase();
			const lastInit = names.length > 1 ? names.reverse()[0].charAt(0).toUpperCase() : '';

			this.initials = `${firstInit}${lastInit}`;
		}
	}
}