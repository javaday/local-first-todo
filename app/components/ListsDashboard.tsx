import { ActionIcon, Affix, Box, Group, LoadingOverlay } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import { useLists } from "~/data/hooks/useLists";
import { ListModel } from "~/data/models/list.model";
import { MemberModel } from "~/data/models/member.model";
import { TaskModel } from "~/data/models/task.model";
import { showErrorNotification, showSuccessNotification } from "~/utils/notification.utils";
import { defaultEditListDialogProps, EditListDialog, EditListDialogProps } from "./EditListDialog";
import { ListCard } from "./ListCard";
import { defaultListMembersDialogProps, ListMembersDialog, ListMembersDialogProps } from "./ListMembersDialog";

export function ListsDashboard() {

	const { member } = useOutletContext<{ member: MemberModel }>();
	const [lists, setLists] = useState<ListModel[]>([]);
	const [editDialogProps, setEditDialogProps] = useState<EditListDialogProps>(defaultEditListDialogProps);
	const [listMembersDialogProps, setListMembersDialogProps] = useState<ListMembersDialogProps>(defaultListMembersDialogProps);
	const [overlay, setOverlay] = useState(false);
	const { addList, addTask, updateTask, deleteTask } = useLists();

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
		setEditDialogProps({
			opened: true,
			list: list,
			onSave: saveList,
			onSaveTask: saveTask,
			onCancel: () => {
				setEditDialogProps(defaultEditListDialogProps);
			}
		});
	}

	function editListMembers(list: ListModel) {
		setListMembersDialogProps({
			opened: true,
			list: list,
			onClose: () => {
				setListMembersDialogProps(defaultListMembersDialogProps);
			}
		});
	}

	function saveList(list: ListModel) {
		setEditDialogProps(defaultEditListDialogProps);
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

	return (
		<>
			<EditListDialog {...editDialogProps} />
			<ListMembersDialog {...listMembersDialogProps} />
			<Box pos="relative">
				<LoadingOverlay visible={overlay} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
				<Group>
					{lists.length === 0 && <p>No lists yet.</p>}
					{lists.map((list) => (
						<ListCard key={list.id} list={list} onClick={() => { editList(list); }} onMembersClick={editListMembers} />
					))}
				</Group>
				<Affix position={{ bottom: 40, right: 40 }}>
					<ActionIcon variant="filled" size="xl" radius="xl" aria-label="Add List" onClick={() => addNewList()}>
						<IconPlus style={{ width: '70%', height: '70%' }} stroke={1.5} />
					</ActionIcon>
				</Affix>
			</Box>
		</>
	);
};