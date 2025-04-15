import { Button, Group, Stack, TextInput, Tooltip } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCheck, IconX } from "@tabler/icons-react";
import { ListModel } from "~/data/models/list.model";
import { useListsContext } from "./Context";

export interface EditorProps {
	list: ListModel;
}

export function Editor(props: EditorProps) {

	const { list } = props;
	const { saveList, closeDialog } = useListsContext();
	const isNew = !list.createdAt;

	const form = useForm({
		initialValues: {
			name: list.name,
			description: list.description,
		},

		initialErrors: {
			name: ''
		},

		validate: {
			name: (value) => { if (!value) return 'Name is required.'; },
		},
	});

	function trySave() {

		const result = form.validate();

		if (!result.hasErrors) {
			list.name = form.values.name;
			list.description = form.values.description;
			saveList(list);
		}
	}

	return (
		<>
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
				<Tooltip label={isNew ? 'Add List' : 'Save List'} openDelay={1000} withArrow>
					<Button leftSection={<IconCheck size={18} />} aria-label={isNew ? 'Add List' : 'Save List'} onClick={trySave}>
						{isNew ? 'Add' : 'Save'}
					</Button>
				</Tooltip>
				{isNew &&
					<Tooltip label="Cancel" openDelay={1000} withArrow>
						<Button leftSection={<IconX size={18} />} color="red" aria-label="Cancel" onClick={closeDialog}>
							Cancel
						</Button>
					</Tooltip>
				}
			</Group>
		</>
	);
}