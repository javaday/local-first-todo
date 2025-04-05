import { AuditModel } from "./audit.model";
import { MemberModel } from "./member.model";
import { TaskModel } from "./task.model";


export class ListModel extends AuditModel {

	memberId: string = '';
	name: string = '';
	description: string = '';

	members: MemberModel[] = [];
	tasks: TaskModel[] = [];

	getData() {
		const auditData = super.getData();
		return {
			memberId: this.memberId,
			name: this.name,
			description: this.description,
			...auditData
		}
	}

	constructor(data: any = {}) {
		super(data);
		this.memberId = data.memberId || '';
		this.name = data.name || '';
		this.description = data.description || '';

		this.members = (data.members || []).map((m: any) => new MemberModel(m));
		this.tasks = (data.tasks || []).map((t: any) => new TaskModel(t));
	}
}