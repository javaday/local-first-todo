import { Button, Group, Modal, Stack, TextInput, Tooltip } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useScreenInfo } from "~/hooks/useScreenInfo";

export const defaultInviteMemberDialogProps: InviteMemberDialogProps = {
	opened: false,
	onSave: () => { },
	onCancel: () => { }
};

export interface InviteMemberDialogProps {
	opened: boolean;
	onSave: (email: string) => void;
	onCancel: () => void;
}

export const InviteMemberDialog = (props: InviteMemberDialogProps) => {

	const { opened, onSave, onCancel } = props;
	const [ids, setIds] = useState<string[]>([]);
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

	function trySave() {

		const result = form.validate();

		if (!result.hasErrors) {
			onSave(form.values.email);
		}
	};

	return (
		<>
			<Modal
				opened={opened}
				onClose={onCancel}
				title={'Invite Member'}
				withCloseButton={true}
				transitionProps={{ transition: 'fade', duration: 200 }}
				centered={!isSmall}
				fullScreen={isSmall}>
				<>
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
								<Button leftSection={<IconCheck size={18} />} aria-label="Invite Member" onClick={trySave}>
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
				</>
			</Modal >
		</>
	);
}