import { ActionIcon, Checkbox, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useHover } from "@mantine/hooks";
import { IconPlus, IconX } from "@tabler/icons-react";
import { useEffect } from "react";
import { TaskModel } from "~/data/models/task.model";
import { showErrorNotification } from "~/utils/notification.utils";

interface TaskEditorProps {
	task: TaskModel;
	onSave: (task: TaskModel) => void;
	onDelete: (task: TaskModel) => void;
}

export function TaskEditor(props: TaskEditorProps) {

	const { task, onSave, onDelete } = props;
	const { hovered, ref } = useHover();
	const isNew = !task.label && !task.createdAt;

	const form = useForm({
		initialValues: {
			label: task.label,
			checked: task.isChecked,
		},
	});

	useEffect(() => {
		if (task) {
			form.setFieldValue('label', task.label);
			form.setFieldValue('checked', task.isChecked);
		}
	}, [task]);

	const trySave = () => {

		const values = form.getValues();

		if (values.label) {
			const updatedTask = new TaskModel({
				...task.getData(),
				label: values.label,
				isChecked: values.checked,
			})
			onSave(updatedTask);
		}
		else {
			showErrorNotification('Save Task', 'A task label is reqired.');
		}
	};

	const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			trySave();
		}
	};

	const toggleChecked = (checked: boolean) => {
		form.setFieldValue('checked', checked);
		trySave();
	};

	const deleteTask = (task: TaskModel) => {
		onDelete(task);
	};

	return (
		<Group ref={ref} justify="space-between" p={0}>
			<Group gap={5} p={0}>
				{isNew && <IconPlus size={16} />}
				{!isNew &&
					<Checkbox checked={form.values.checked} onChange={(event) => toggleChecked(event.currentTarget.checked)} />
				}
				<TextInput
					variant="unstyled"
					key={form.key('label')}
					placeholder="New Task"
					value={form.values.label}
					onChange={(event) => form.setFieldValue('label', event.currentTarget.value)}
					onKeyUp={handleKeyUp}
				/>
			</Group>
			{hovered && !isNew &&
				<ActionIcon variant="transparent" color="gray" size="xs" onClick={() => deleteTask(task)}>
					<IconX />
				</ActionIcon>
			}
		</Group>
	);
}