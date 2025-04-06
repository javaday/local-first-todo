import { Box, Button, Group, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";


interface VerifyEmailProps {
	shouldExist: boolean;
	onLoading: () => void;
	onVerified: (email: string, verified: boolean) => void;
}

export function VerifyEmail(props: VerifyEmailProps) {

	const { onLoading, onVerified, shouldExist } = props;

	const emailFetcher = useFetcher<{ verified: boolean }>();

	const [apiCalled, setApiCalled] = useState(false);
	const [emailExists, setEmailExists] = useState(false);
	const [email, setEmail] = useState('');

	const emailRegex = /^[\w-./+]+@([\w-/+]+\.)+[\w-]{2,4}$/gi;

	useEffect(() => {
		if (emailFetcher.state === 'idle' && emailFetcher.data) {
			if (emailFetcher.data.verified) {
				onVerified(email, true);
			}
			else {
				setEmailExists(false);
				onVerified(email, false);
			}
		}
	}, [emailFetcher, onVerified, email]);

	const form = useForm({
		initialValues: {
			email: ''
		},

		initialErrors: {
			email: ''
		},

		validate: {
			email: (value: string) => {
				if (apiCalled && shouldExist && !emailExists) {
					return 'An account with this email address could not be found';
				}
				else if (value.length < 1) {
					return 'An email is required';
				}
				else if (emailRegex.test(value) === false) {
					return 'A valid email address is required';
				}
				return null;
			},
		},
	});

	const tryVerify = () => {

		const result = form.validate();

		if (!result.hasErrors) {

			const values = form.getValues();

			emailFetcher.submit({
				...values
			}, {
				action: '/api/verify/email',
				method: 'POST'
			});

			setEmail(values.email);
			setApiCalled(true);
			onLoading();
		}
	};

	return (
		<emailFetcher.Form method="post" action="/api/verify/email">
			<Box mx="auto">
				<Group justify="center">
					<Text size="md">Enter your email address:</Text>
				</Group>
				<Group justify="center" mt={20}>
					<TextInput
						ref={node => node ? node.focus() : undefined}
						name="email"
						placeholder="Email Address"
						key={form.key('email')}
						{...form.getInputProps('email')}
						error={form.errors.email}
					/>
				</Group>
				<Group justify="center" mt="md">
					<Button onClick={tryVerify}>
						Verify
					</Button>
				</Group>
			</Box>
		</emailFetcher.Form>
	);
}