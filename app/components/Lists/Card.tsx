import { ActionIcon, Avatar, Button, Card, Divider, Group, Progress, Text, Title, Tooltip } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { ListModel } from "~/data/models/list.model";
import { MemberModel } from "~/data/models/member.model";
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

	const avatar = (member: MemberModel) => {

		const isOwner = member.id === list.memberId;

		return (
			<Tooltip withArrow key={member.id} label={isOwner ? `${member.name} (Owner)` : member.name}>
				<Avatar src={member.avatarUrl} alt={member.email} color={isOwner ? 'blue' : undefined}>
					{member.initials}
				</Avatar>
			</Tooltip>
		);
	};

	const avatars = () => {

		if (list.members.length > 3) {
			return (
				<Tooltip.Group openDelay={300} closeDelay={100}>
					<Avatar.Group spacing="sm">
						{
							list.members.slice(0, 2).map((member) => avatar(member))
						}
						{
							<Tooltip withArrow label={
								list.members.slice(3).map((member) => (
									<div key={member.id}>{member.name}</div>
								))
							}>
								<Avatar>
									{`+${list.members.length - 3}`}
								</Avatar>
							</Tooltip>
						}
					</Avatar.Group>
				</Tooltip.Group>
			);
		}
		else {
			return (
				<Tooltip.Group openDelay={300} closeDelay={100}>
					<Avatar.Group spacing="sm">
						{
							list.members.map((member) => avatar(member))
						}
					</Avatar.Group>
				</Tooltip.Group>
			);
		}
	};

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
				{avatars()}
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