import { Box, Button, Group, LoadingOverlay, Modal, Stack, TextInput, Tooltip } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { MemberModel } from "~/data/models/member.model";
import { useScreenInfo } from "~/hooks/useScreenInfo";
import { showErrorNotification, showSuccessNotification } from "~/utils/notification.utils";

export const defaultInviteMemberDialogProps: InviteMemberDialogProps = {
	opened: false,
	member: new MemberModel(),
	onCancel: () => { }
};

export interface InviteMemberDialogProps {
	opened: boolean;
	member: MemberModel;
	onCancel: () => void;
}

export const InviteMemberDialog = (props: InviteMemberDialogProps) => {

	const { opened, member, onCancel } = props;
	const [ids, setIds] = useState<string[]>([]);
	const inviteFetcher = useFetcher<{ sent: boolean, error: string }>();
	const { isSmall } = useScreenInfo();

	const emailRegex = /^[\w-./+]+@([\w-/+]+\.)+[\w-]{2,4}$/gi;

	const form = useForm({
		initialValues: {
			email: ''
		},
		initialErrors: {
			email: '',
		},
		validate: {
			email: (value) => {
				if (!value) {
					return 'An email address is required';
				}
				else if (emailRegex.test(value) === false) {
					return 'A valid email address is required';
				}
				return null;
			},
		},
	});

	useEffect(() => {
		if (opened) {
			form.setValues({ email: '' });
			form.clearErrors();
		}
	}, [opened]);

	useEffect(() => {
		if (inviteFetcher.state === 'idle' && inviteFetcher.data) {
			if (inviteFetcher.data.sent) {
				showSuccessNotification('Invite Member', `'${form.values.email}' has been invited.`);
				onCancel();
			}
			else {
				showErrorNotification('Invite Member Error', inviteFetcher.data.error);
			}
		}
	}, [inviteFetcher]);

	function trySend() {

		const result = form.validate();

		if (!result.hasErrors) {
			const formData = new FormData();

			formData.append('token', member.token);
			formData.append('email', form.values.email);

			inviteFetcher.submit(formData, {
				action: '/api/invite/member',
				method: 'POST'
			});
		}
	};

	const sendInvite = (email: string) => {
		const formData = new FormData();

		formData.append('token', member.token);
		formData.append('email', email);

		inviteFetcher.submit(formData, {
			action: '/api/invite/member',
			method: 'POST'
		});
	}

	return (
		<>
			<Modal
				opened={opened}
				onClose={onCancel}
				title={'Invite Member'}
				withCloseButton={true}
				transitionProps={{ transition: 'fade', duration: 200 }}
				size="auto"
				centered={!isSmall}
				fullScreen={isSmall}>
				<Box pos="relative">
					<LoadingOverlay visible={inviteFetcher.state === 'submitting'} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
					<Stack>
						<TextInput
							withAsterisk
							label="Email"
							key={form.key('email')}
							value={form.values.email}
							error={form.errors.email}
							onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
							w={300}
						/>
						<Group justify={'center'}>
							<Tooltip label="Invite Member" openDelay={1000} withArrow>
								<Button leftSection={<IconCheck size={18} />} aria-label="Invite Member" onClick={trySend}>
									Invite
								</Button>
							</Tooltip>
							<Tooltip label="Cancel" openDelay={1000} withArrow>
								<Button leftSection={<IconX size={18} />} color="red" aria-label="Cancel" onClick={onCancel}>
									Cancel
								</Button>
							</Tooltip>
						</Group>
					</Stack>
				</Box>
			</Modal >
		</>
	);
}