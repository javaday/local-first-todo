import type { InstantRules } from '@instantdb/react';

const rules = {
	lists: {
		allow: {
			view: 'auth.id != null',
			create: 'isOwner',
			update: 'isOwner',
			delete: 'isOwner',
		},
		bind: ['isOwner', 'auth.id != null && auth.id == data.memberId'],
	},
} satisfies InstantRules;

export default rules;