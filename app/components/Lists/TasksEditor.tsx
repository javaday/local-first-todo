import { Divider, Group, ScrollArea, SegmentedControl, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { useTasks } from "~/data/hooks/useTasks";
import { ListModel } from "~/data/models/list.model";
import { TaskModel } from "~/data/models/task.model";
import { useListsContext } from "./Context";
import { TaskEditor } from "./TaskEditor";

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';


dayjs.extend(utc);

export const defaultTasksEditorProps: TasksEditorProps = {
	list: new ListModel(),
};

export interface TasksEditorProps {
	list: ListModel;
}

export function TasksEditor(props: TasksEditorProps) {

	const { list } = props;
	const { saveTask } = useListsContext();
	const [listTasks, setListTasks] = useState<TaskModel[]>([]);
	const [filter, setFilter] = useState('all');
	const [taskCount, setTaskCount] = useState(0);
	const [checkedCount, setCheckedCount] = useState(0);

	const { tasks } = useTasks(list.id);

	useEffect(() => {
		if (tasks) {
			const filtered = tasks.filter((task) => {
				if (filter === 'active') {
					return !task.isChecked;
				}
				if (filter === 'checked') {
					return task.isChecked;
				}
				return true;
			});
			setListTasks(filtered);

			const checked = tasks.filter((task) => task.isChecked).length;
			setCheckedCount(checked);
			setTaskCount(tasks.length);
		}
		else {
			setListTasks([]);
		}
	}, [tasks, filter]);

	function onSaveTask(task: TaskModel) {

		if (!task.createdAt) {
			task.listId = list.id;
		}

		saveTask(task);
	}

	function onDeleteTask(task: TaskModel) {
		task.isDeleted = true;
		saveTask(task);
	}

	return (
		<Stack gap={10}>
			<Group justify="space-between">
				<Text size="sm">{taskCount - checkedCount} tasks remaining</Text>
				<SegmentedControl
					value={filter}
					onChange={setFilter}
					size="xs"
					data={[
						{ label: 'All', value: 'all' },
						{ label: 'Active', value: 'active' },
						{ label: 'Checked', value: 'checked' }
					]}
				/>
			</Group>
			<Divider />
			<ScrollArea h={200} type="always" overscrollBehavior="contain">
				<Stack gap={0}>
					{listTasks.map((task) => <TaskEditor key={task.id} task={task} onSave={saveTask} onDelete={onDeleteTask} />)}
				</Stack>
			</ScrollArea>
			<Divider />
			<TaskEditor task={new TaskModel()} onSave={onSaveTask} onDelete={onDeleteTask} />
		</Stack>
	);
}