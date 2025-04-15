
import { Box, LoadingOverlay } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useFetcher, useOutletContext } from 'react-router';
import { useLists } from '~/data/hooks/useLists';
import { InvitationSendResult } from '~/data/models/invitation.model';
import { ListModel } from '~/data/models/list.model';
import { MemberModel } from '~/data/models/member.model';
import { TaskModel } from '~/data/models/task.model';
import { showErrorNotification, showSuccessNotification } from '~/utils/notification.utils';
import { ConfirmDialog, ConfirmDialogProps, defaultConfirmDialogProps } from '../ConfirmDialog';
import { Card } from './Card';
import { ListsContext, useListsContext } from './Context';
import { Dashboard } from './Dashboard';
import { Editor } from './Editor';
import { defaultDialogProps, ListDialog, ListDialogProps } from './ListDialog';
import { MembersEditor } from './MembersEditor';


interface ListsRootProps {
	children: React.ReactNode;
}

function Root({ children }: ListsRootProps) {

	const { member } = useOutletContext<{ member: MemberModel }>();
	const [lists, setLists] = useState<ListModel[]>([]);
	const [dialogProps, setDialogProps] = useState<ListDialogProps>(defaultDialogProps);
	const [confirmDialogProps, setConfirmDialogProps] = useState<ConfirmDialogProps>(defaultConfirmDialogProps);

	const [overlay, setOverlay] = useState(false);
	const { addList, addTask, updateTask, deleteList, deleteTask } = useLists();

	const inviteFetcher = useFetcher<InvitationSendResult>();

	useEffect(() => {
		if (member) {
			setLists(member.lists);
		}
		else {
			setLists([]);
		}
	}, [member]);

	function addNewList() {
		editList(new ListModel());
	}

	function editList(list: ListModel) {
		setDialogProps({
			opened: true,
			title: list.createdAt ? 'Edit List' : 'Add List',
			size: 'sm',
			children: <Editor list={list} />,
		});
	}

	function editListMembers(list: ListModel) {
		setDialogProps({
			opened: true,
			title: 'List Members',
			size: 'lg',
			children: <MembersEditor list={list} />,
		});
	}

	function editListTasks(list: ListModel) {
		setDialogProps({
			opened: true,
			title: 'List Tasks',
			size: 'lg',
			children: <MembersEditor list={list} />,
		});
	}

	function saveList(list: ListModel) {
		closeDialog();
		setOverlay(true);
		setTimeout(() => {
			addList(list)
				.then(() => {
					showSuccessNotification('Save List', `The '${list.name}' list has been saved.`);
				})
				.catch((error) => {
					showErrorNotification('Add Organization Error', error);
				})
				.finally(() => {
					setOverlay(false);
				});
		}, 250);
	}

	function saveTask(task: TaskModel) {

		if (task.isDeleted) {
			deleteTask(task)
				.then(() => {
					showSuccessNotification('Delete Task', `The task has been deleted.`);
				})
				.catch((error) => {
					showErrorNotification('Delete Task Error', error);
				});
		}
		else if (!task.createdAt) {
			addTask(task)
				.then(() => {
					showSuccessNotification('Add Task', `The task has been added.`);
				})
				.catch((error) => {
					showErrorNotification('Add Task Error', error);
				});
		}
		else {
			updateTask(task)
				.then(() => {
					showSuccessNotification('Update Task', `The task has been updated.`);
				})
				.catch((error) => {
					showErrorNotification('Update Task Error', error);
				});
		}
	}

	function confirmDeleteList(model: ListModel) {
		setConfirmDialogProps({
			opened: true,
			prompt: `Are you sure you want to remove '${model.name}'?`,
			onYes: () => {
				setConfirmDialogProps(defaultConfirmDialogProps);
				deleteList(model)
					.then(() => {
						showSuccessNotification('Delete List', `The '${model.name}' list has been deleted.`);
					})
					.catch((error) => {
						showErrorNotification('Delete List Error', error);
					});
			},
			onNo: () => { setConfirmDialogProps(defaultConfirmDialogProps) }
		});
	}

	function inviteListMember(list: ListModel, email: string) {

		const formData = new FormData();

		formData.append('token', member.token);
		formData.append('listId', list.id);
		formData.append('email', email);

		inviteFetcher.submit(formData, {
			action: '/api/invite/list/member',
			method: 'POST'
		});
	}

	function closeDialog() {
		setDialogProps(defaultDialogProps);
	}

	const value = {
		member,
		lists,
		addNewList,
		editList,
		editListMembers,
		saveList,
		saveTask,
		confirmDeleteList,
		inviteListMember,
		closeDialog
	};

	return (
		<ListsContext.Provider value={value}>
			<ConfirmDialog {...confirmDialogProps} />
			<ListDialog {...dialogProps} />
			<Box pos="relative">
				<LoadingOverlay visible={overlay} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
				{children}
			</Box>
		</ListsContext.Provider>
	);
}

const Lists = {
	Root,
	Dashboard,
	Card
};

export {
	Lists,
	useListsContext
};
