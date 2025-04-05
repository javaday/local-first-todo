import { id } from "@instantdb/react";

export class AuditModel {
	id: string = '';
	createdBy: string = '';
	createdAt: number = 0;
	updatedBy?: string;
	updatedAt?: number;

	getData() {
		return {
			id: this.id,
			createdBy: this.createdBy,
			createdAt: this.createdAt,
			updatedBy: this.updatedBy,
			updatedAt: this.updatedAt,
		}
	};

	constructor(data: any = {}) {
		this.id = data.id || id();
		this.createdBy = data.createdBy || '';
		this.createdAt = data.createdAt || 0;
		this.updatedBy = data.updatedBy || '';
		this.updatedAt = data.updatedAt || 0;
	};
};