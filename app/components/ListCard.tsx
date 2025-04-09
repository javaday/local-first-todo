import { ActionIcon, Group, Paper, Text, Title } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { IconPencil } from "@tabler/icons-react";
import { ListModel } from "~/data/models/list.model";

interface ListCardProps {
	list: ListModel,
	onClick: () => void;
};

export function ListCard(props: ListCardProps) {

	const { list, onClick } = props;
	const { hovered, ref } = useHover();

	return (
		<Paper ref={ref} shadow="xs" p="sm" w={250}>
			<Group justify="space-between">
				<Title order={4}>{list.name}</Title>
				{hovered &&
					<ActionIcon variant="transparent" size="sm" onClick={onClick}>
						<IconPencil />
					</ActionIcon>
				}
			</Group>
			<Text size="sm" c="dimmed" truncate="end">
				Use it to create cards, dropdowns, modals and other components that require background
				with shadow
			</Text>
		</Paper>
	);
}