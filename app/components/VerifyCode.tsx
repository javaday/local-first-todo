import { Box, Button, Group, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMember } from "~/data/hooks/useMember";


interface VerifyCodeProps {
	email: string;
	onLoading: () => void;
	onVerified: (code: string, verified: boolean, error?: Error) => void;
}

export function VerifyCode(props: VerifyCodeProps) {

	const { verifyCode } = useMember();
	const { email, onLoading, onVerified } = props;

	const form = useForm({
		initialValues: {
			code: ''
		},

		initialErrors: {
			code: ''
		},

		validate: {
			code: (value: string) => {
				if (value.length < 1) {
					return 'A code is required';
				}
				return null;
			},
		},
	});

	const tryVerify = () => {

		const result = form.validate();

		if (!result.hasErrors) {

			onLoading();

			const values = form.getValues();

			verifyCode(email, values.code)
				.then(() => {
					onVerified(values.code, true);
				})
				.catch((response) => {
					const err = new Error(response.body.message, {
						cause: response
					});
					onVerified(values.code, false, err);
					form.setErrors({ code: 'This code is invalid or expired.' });
				});
		};
	}

	return (
		<Box mx="auto">
			<Group justify="center">
				<Stack>
					<Text size="md">Enter the magic code sent to:</Text>
					<Text size="lg" fw={700}>{email}</Text>
				</Stack>
			</Group>
			<Group justify="center" mt={20}>
				<form>
					<TextInput
						ref={node => node ? node.focus() : undefined}
						name="code"
						placeholder="Magic Code"
						key={form.key('code')}
						{...form.getInputProps('code')}
					/>
				</form>
			</Group>
			<Group justify="center" mt="md">
				<Button onClick={tryVerify}>
					Verify
				</Button>
			</Group>
		</Box>
	);
}