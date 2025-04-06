import { Center, Stack } from "@mantine/core";
import { AcceptInvite } from "~/components/auth/AcceptInvite";
import { Role } from "~/data/models/enums";
import { getInvitation } from "~/services/data/invitations.service";
import { toUUID } from "~/utils/uuid.utils";
import { Route } from "./+types/accept";

export async function loader({ params }: Route.LoaderArgs) {

	const shortId = params.shortId || '';
	const id = toUUID(shortId);
	const invitation = await getInvitation(id);

	return {
		token: shortId,
		role: invitation?.role || Role.TeamMember,
	};
}

export function HydrateFallback() {
	return <div>Loading...</div>;
}

export default function AccpetRoute({ loaderData }: Route.ComponentProps) {

	const { token, role } = loaderData;

	return (
		<Center pt={50}>
			<Stack>
				<AcceptInvite token={token} />
			</Stack>
		</Center >
	);
}