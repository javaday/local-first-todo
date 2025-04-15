import { ActionIcon, Affix, Group } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { Lists, useListsContext } from "./Root";

export function Dashboard() {

	const { lists, addNewList } = useListsContext();

	return (
		<>
			<Group>
				{lists.length === 0 && <p>No lists yet.</p>}
				{lists.map((list) => (
					<Lists.Card key={list.id} list={list} />
				))}
			</Group>
			<Affix position={{ bottom: 40, right: 40 }}>
				<ActionIcon variant="filled" size="xl" radius="xl" aria-label="Add List" onClick={() => addNewList()}>
					<IconPlus style={{ width: '70%', height: '70%' }} stroke={1.5} />
				</ActionIcon>
			</Affix>
		</>
	);
};