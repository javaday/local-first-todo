import { AuditModel } from "./audit.model";

export class TaskModel extends AuditModel {

	listId: string = '';
	label: string = '';
	isChecked: boolean = false;
	isDeleted: boolean = false;

	getData() {
		const auditData = super.getData();
		return {
			listId: this.listId,
			label: this.label,
			isChecked: this.isChecked,
			isDeleted: this.isDeleted,
			...auditData
		}
	}

	constructor(data: any = {}) {
		super(data);
		this.listId = data.listId || '';
		this.label = data.label || '';
		this.isChecked = data.isChecked || false;
		this.isDeleted = data.isDeleted || false;
	}
}