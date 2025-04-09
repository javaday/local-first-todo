import { Center, Stack, Text } from "@mantine/core";
import { AcceptInvite } from "~/components/AcceptInvite";
import { getInvitation } from "~/services/data/invitations.service";
import { toUUID } from "~/utils/uuid.utils";
import { Route } from "./+types/accept";

interface TokenVerification {
	token: string;
	exists: boolean;
}

export async function loader({ params }: Route.LoaderArgs): Promise<TokenVerification> {

	const shortId = params.shortId || '';
	const id = toUUID(shortId);
	const invitation = await getInvitation(id);

	if (invitation) {
		return {
			token: shortId,
			exists: true
		};
	}
	else {
		return {
			token: shortId,
			exists: false
		};
	}
}

export function HydrateFallback() {
	return <div>Loading...</div>;
}

export default function AccpetRoute({ loaderData }: Route.ComponentProps) {

	const data = loaderData;

	return (
		<Center pt={50}>
			<Stack>
				{data.exists && <AcceptInvite token={data.token} />}
				{!data.exists && <Text fw={700} c="red">This invitation is not valid.</Text>}
			</Stack>
		</Center >
	);
}