import { createContext, useContext } from "react";
import { ListModel } from "~/data/models/list.model";
import { MemberModel } from "~/data/models/member.model";
import { TaskModel } from "~/data/models/task.model";

export interface ListsContextProps {
	member: MemberModel;
	lists: ListModel[];
	addNewList: () => void;
	editList: (list: ListModel) => void;
	editListMembers: (list: ListModel) => void;
	editListTasks: (list: ListModel) => void;
	saveList(list: ListModel): void;
	saveTask(task: TaskModel): void;
	confirmDeleteList(list: ListModel): void;
	inviteListMember(list: ListModel, email: string): void;
	closeDialog(): void;
}

export const ListsContext = createContext<ListsContextProps>({
	member: new MemberModel(),
	lists: [],
	addNewList: () => { },
	editList: () => { },
	editListMembers: () => { },
	editListTasks: () => { },
	saveList: () => { },
	saveTask: () => { },
	confirmDeleteList: () => { },
	inviteListMember: () => { },
	closeDialog: () => { },
});

export const useListsContext = () => {
	const context = useContext(ListsContext);
	if (!context) {
		throw new Error('Lists subcomponents must be used within Lists.Root');
	}
	return context;
}