import { i } from "@instantdb/react";

const auditFields = {
	createdAt: i.number().indexed(),
	createdBy: i.string().indexed(),
	updatedAt: i.number().indexed(),
	updatedBy: i.string().indexed(),
};

const _schema = i.schema({
	entities: {
		$users: i.entity({
			email: i.any().unique().indexed(),
		}),
		members: i.entity({
			role: i.string().indexed(),
			email: i.string().indexed(),
			name: i.string().indexed(),
			firstName: i.string().optional(),
			lastName: i.string().optional(),
			avatarUrl: i.string().optional(),
			...auditFields
		}),
		lists: i.entity({
			memberId: i.string().indexed(),
			name: i.string().indexed(),
			description: i.string().optional(),
			...auditFields
		}),
		tasks: i.entity({
			listId: i.string().indexed(),
			label: i.string().indexed(),
			isChecked: i.boolean(),
			...auditFields
		}),
		invitations: i.entity({
			listId: i.string().indexed(),
			email: i.string().indexed(),
			sentBy: i.string().indexed(),
			sentAt: i.number(),
			expiresAt: i.number(),
			acceptedAt: i.number(),
			...auditFields
		}),
	},
	links: {
		userMembership: {
			forward: { on: 'members', has: 'one', label: 'user' },
			reverse: { on: '$users', has: 'one', label: 'member' },
		},
		userLists: {
			forward: { on: 'members', has: 'many', label: 'lists' },
			reverse: { on: 'lists', has: 'many', label: 'users' },
		},
		listInvitations: {
			forward: { on: 'lists', has: 'many', label: 'invitations' },
			reverse: { on: 'invitations', has: 'one', label: 'list', onDelete: 'cascade' },
		},
		listTasks: {
			forward: { on: 'lists', has: 'many', label: 'tasks' },
			reverse: { on: 'tasks', has: 'one', label: 'list', onDelete: 'cascade' },
		},
	},
	rooms: {},
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema { }
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
