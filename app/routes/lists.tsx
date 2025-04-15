import { Lists } from "~/components/Lists/Root";

export function HydrateFallback() {
	return <div>Loading...</div>;
}

export default function ListsRoute() {

	return (
		<>
			<Lists.Root>
				<Lists.Dashboard />
			</Lists.Root>
		</>
	);
}