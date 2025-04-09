import { Anchor, Box, Button, Group, Loader, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { InviteAcceptResult } from "~/data/models/invitation.model";


interface AcceptInviteProps {
	token: string
}

export function AcceptInvite(props: AcceptInviteProps) {

	const { token } = props;
	const [registered, setRegistered] = useState(false);
	const acceptFetcher = useFetcher<InviteAcceptResult>();

	useEffect(() => {

		if (acceptFetcher.data && acceptFetcher.data.registered) {
			setRegistered(true);
		}

	}, [acceptFetcher.data]);

	const form = useForm({
		initialValues: {
			name: '',
			email: ''
		},

		initialErrors: {
			name: '',
			email: ''
		},

		validate: {
			name: (value: string) => (value.length > 1 ? null : 'A name is required'),
			email: (value: string) => (value.length > 1 ? null : 'An email is required'),
		},
	});

	const tryAccept = () => {

		const result = form.validate();

		if (!result.hasErrors) {
			const values = form.getValues();
			acceptFetcher.submit({
				...values,
				token
			}, {
				action: '/api/accept/invite',
				method: 'POST'
			});
		}
	};

	return (
		<acceptFetcher.Form>
			{acceptFetcher.state === 'idle' && acceptFetcher.data == null &&
				<Box mx="auto">
					<Group justify="center">
						<h3>Enter your name &amp; email address.</h3>
					</Group>
					<Stack>
						<TextInput
							name="name"
							placeholder="Name"
							key={form.key('name')}
							value={form.values.name}
							error={form.errors.name}
							onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
						/>
						<TextInput
							name="email"
							placeholder="Email Address"
							key={form.key('email')}
							value={form.values.email}
							error={form.errors.email}
							onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
						/>
					</Stack>
					<Group justify="center" mt="md">
						<Button onClick={tryAccept}>
							Accept
						</Button>
					</Group>
				</Box>
			}
			{acceptFetcher.state === 'submitting' &&
				<Box mx="auto">
					<Group justify="center" mt="md">
						<Loader color="blue" />
					</Group>
				</Box>
			}
			{acceptFetcher.state === 'idle' && acceptFetcher.data && acceptFetcher.data.expired &&
				<Box mx="auto">
					<Group justify="center" mt="md">
						<h3>This invitation is expired.</h3>
					</Group>
				</Box>
			}
			{acceptFetcher.state === 'idle' && acceptFetcher.data && !acceptFetcher.data.valid &&
				<Box mx="auto">
					<Group justify="center" mt="md">
						<h3>{acceptFetcher.data.error}</h3>
					</Group>
				</Box>
			}
			{registered &&
				<Box mx="auto">
					<Group justify="center" mt="md">
						<h3>Welcome!</h3>
						<h3>You can now <Anchor href="/login">Login</Anchor></h3>
					</Group>
				</Box>
			}
		</acceptFetcher.Form>
	);
}