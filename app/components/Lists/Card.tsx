import { ActionIcon, Button, Card, Divider, Group, Progress, Text, Title, Tooltip } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { ListModel } from "~/data/models/list.model";
import { Avatars } from "./Avatars";
import { useListsContext } from "./Context";

interface ListCardProps {
	list: ListModel,
};

export function ListCard(props: ListCardProps) {

	const { list } = props;
	const { member, editList, editListMembers, editListTasks, confirmDeleteList } = useListsContext();
	const { hovered: nameHovered, ref: nameRef } = useHover();
	const { hovered: membersHovered, ref: membersRef } = useHover();

	const taskCount = list.tasks.length;
	const checkedCount = list.tasks.filter((task) => task.isChecked).length;
	const progress = taskCount === 0 ? 0 : (checkedCount / taskCount) * 100;


	return (
		<Card shadow="xs" p="sm" w={250}>
			<Card.Section>
				<Tooltip label={`${checkedCount} of ${taskCount} tasks completed`} withArrow>
					<Progress.Root size={15}>
						<Progress.Section value={progress} color="blue"></Progress.Section>
					</Progress.Root>
				</Tooltip>
			</Card.Section>
			<Group ref={nameRef} justify="space-between" mt={10}>
				<Title order={4}>{list.name}</Title>
				{nameHovered &&
					<Group gap={0}>
						<ActionIcon variant="transparent" size="sm" onClick={() => editList(list)}>
							<IconPencil />
						</ActionIcon>
						<ActionIcon variant="transparent" size="sm" color="red" onClick={() => confirmDeleteList(list)}>
							<IconTrash />
						</ActionIcon>
					</Group>

				}
			</Group>
			<Text size="xs" c="dimmed" truncate="end">
				Use it to create cards, dropdowns, modals and other components that require background
				with shadow
			</Text>
			<Divider my={10} />
			<Group ref={membersRef} justify="space-between">
				<Avatars list={list} member={member} />
				{membersHovered &&
					<Group gap={0}>
						<ActionIcon variant="transparent" size="sm" onClick={() => editListMembers(list)}>
							<IconPencil />
						</ActionIcon>
					</Group>
				}
			</Group>
			<Divider my={10} />
			<Button variant="outline" fullWidth onClick={() => editListTasks(list)}>
				{taskCount > 0 &&
					<>{taskCount} Tasks</>
				}
				{taskCount === 0 &&
					<Text size="sm" c="dimmed">
						No Tasks
					</Text>
				}
			</Button>
		</Card>
	);
}