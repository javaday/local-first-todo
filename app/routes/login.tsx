import { Center, Stack, Text } from "@mantine/core";
import Logo from "~/components/Logo";
import { MagicCode } from "~/components/MagicCode";

export function HydrateFallback() {
	return <div>Loading...</div>;
}

export default function Login() {

	return (
		<Center pt={50}>
			<Stack gap={5} align={'center'}>
				<Logo height={200} />
				<Text className={'lilita-one-regular'}>Local-First ToDo</Text>
				<MagicCode />
			</Stack>
		</Center >
	);
}