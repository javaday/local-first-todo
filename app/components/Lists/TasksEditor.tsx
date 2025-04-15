import { Button, Group, Modal, Stack, Tabs, TextInput, Tooltip } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCheck, IconLabel, IconUsers, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { ListModel } from "~/data/models/list.model";
import { TaskModel } from "~/data/models/task.model";
import { TaskEditor } from "./TaskEditor";

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const defaultTasksEditorProps: TasksEditorProps = {
	opened: false,
	list: new ListModel(),
	onSave: () => { },
	onSaveTask: () => { },
	onCancel: () => { }
};

export interface TasksEditorProps {
	opened: boolean;
	list: ListModel;
	onSave: (model: ListModel) => void;
	onSaveTask: (model: TaskModel) => void;
	onCancel: () => void;
}

export function TasksEditor(props: TasksEditorProps) {

	const { opened, list, onSave, onSaveTask, onCancel } = props;
	const [tasks, setTasks] = useState<TaskModel[]>(list.tasks);
	const isNew = !list.createdAt;

	const form = useForm({
		initialValues: {
			name: '',
			description: '',
		},

		initialErrors: {
			name: ''
		},

		validate: {
			name: (value) => { if (!value) return 'Name is required.'; },
		},
	});

	useEffect(() => {
		if (opened && list) {
			form.setFieldValue('name', list.name);
			form.setFieldValue('description', list.description);
			form.clearErrors();
			setTasks(list.tasks);
		}
		else {
			form.setFieldValue('name', '');
			form.setFieldValue('description', '');
		}
	}, [opened, list]);

	function trySave() {

		const result = form.validate();

		if (!result.hasErrors) {
			list.name = form.values.name;
			list.description = form.values.description;
			onSave(list);
		}
	}

	function saveTask(task: TaskModel) {

		if (!task.createdAt) {
			task.listId = list.id;
			setTasks([...tasks, task]);
		}
		onSaveTask(task);
	}

	function deleteTask(task: TaskModel) {
		setTasks([...tasks.filter(t => t.id !== task.id)]);
		task.isDeleted = true;
		onSaveTask(task);
	}

	return (
		<Modal
			opened={opened}
			onClose={onCancel}
			title={isNew ? 'Add List' : 'Edit List'}
			withCloseButton={true}
			transitionProps={{ transition: 'fade', duration: 200 }}
			size={isNew ? 'xs' : 'auto'}
			centered>
			<Tabs defaultValue={isNew ? 'meta' : 'tasks'} mt={10}>
				{!isNew &&
					<>
						<Tabs.List>
							<Tabs.Tab value="tasks" leftSection={<IconCheck size={12} />}>
								Tasks
							</Tabs.Tab>
							<Tabs.Tab value="members" leftSection={<IconUsers size={12} />}>
								Members
							</Tabs.Tab>
							<Tabs.Tab value="meta" leftSection={<IconLabel size={12} />}>
								Name
							</Tabs.Tab>
						</Tabs.List>
						<Tabs.Panel value="tasks" mt={10}>
							<Stack gap={0}>
								{tasks.map((task) => <TaskEditor key={task.id} task={task} onSave={saveTask} onDelete={deleteTask} />)}
								<TaskEditor task={new TaskModel()} onSave={saveTask} onDelete={() => { }} />
							</Stack>
						</Tabs.Panel>
						<Tabs.Panel value="members" mt={10}>
							Members
						</Tabs.Panel>
					</>
				}
				<Tabs.Panel value="meta" mt={10}>
					<Stack>
						<TextInput
							withAsterisk
							label="Name"
							key={form.key('name')}
							value={form.values.name}
							error={form.errors.name}
							onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
						/>
						<TextInput
							label="Description"
							key={form.key('description')}
							value={form.values.description}
							onChange={(event) => form.setFieldValue('description', event.currentTarget.value)}
						/>
					</Stack>
					<Group justify={'center'} mt={20}>
						<Tooltip label={isNew ? 'Add Contest' : 'Save Changes'} openDelay={1000} withArrow>
							<Button leftSection={<IconCheck size={18} />} aria-label={isNew ? 'Add Contest' : 'Save Changes'} onClick={trySave}>
								{isNew ? 'Add' : 'Save'}
							</Button>
						</Tooltip>
						{isNew &&
							<Tooltip label="Cancel" openDelay={1000} withArrow>
								<Button leftSection={<IconX size={18} />} color="red" aria-label="Cancel" onClick={onCancel}>
									Cancel
								</Button>
							</Tooltip>
						}
					</Group>
				</Tabs.Panel>
			</Tabs>
		</Modal>
	);
}