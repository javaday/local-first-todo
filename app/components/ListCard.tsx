import { ActionIcon, Avatar, Divider, Group, Paper, Progress, Text, Title, Tooltip } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { IconPencil } from "@tabler/icons-react";
import { ListModel } from "~/data/models/list.model";
import { MemberModel } from "~/data/models/member.model";

interface ListCardProps {
	list: ListModel,
	onClick: () => void;
	onMembersClick: (list: ListModel) => void;
};

export function ListCard(props: ListCardProps) {

	const { list, onClick, onMembersClick } = props;
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
		<Paper shadow="xs" p="sm" w={250}>
			<Group ref={nameRef} justify="space-between">
				<Title order={4}>{list.name}</Title>
				{nameHovered &&
					<ActionIcon variant="transparent" size="sm" onClick={onClick}>
						<IconPencil />
					</ActionIcon>
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
					<ActionIcon variant="transparent" size="sm" onClick={() => onMembersClick(list)}>
						<IconPencil />
					</ActionIcon>
				}
			</Group>
			<Divider my={10} />
			{taskCount > 0 &&
				<Tooltip label={`${checkedCount} of ${taskCount} tasks completed`} withArrow>
					<Progress.Root size={25}>
						<Progress.Section value={progress} color="blue">
							<Progress.Label>{`${progress}%`}</Progress.Label>
						</Progress.Section>
					</Progress.Root>
				</Tooltip>
			}
			{taskCount === 0 &&
				<Group justify="center">
					<Text size="sm" c="dimmed">
						No Tasks
					</Text>
				</Group>
			}
		</Paper>
	);
}