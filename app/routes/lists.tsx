import { ListsDashboard } from "~/components/ListsDashboard";

export function HydrateFallback() {
	return <div>Loading...</div>;
}

export default function ListsRoute() {

	return (
		<>
			<ListsDashboard />
		</>
	);
}