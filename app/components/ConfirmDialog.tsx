import { Button, Group, Modal, Stack, Text, Tooltip } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";

export const defaultConfirmDialogProps: ConfirmDialogProps = {
	opened: false,
	prompt: '',
	onYes: () => { },
	onNo: () => { }
};
export interface ConfirmDialogProps {
	opened: boolean;
	title?: string;
	prompt: string;
	onYes: () => void;
	onNo: () => void;
}

export function ConfirmDialog(props: ConfirmDialogProps) {

	const { opened, title = 'Confirm Action', prompt, onYes, onNo } = props;

	return (
		<Modal
			opened={opened}
			onClose={onNo}
			withCloseButton={false}
			transitionProps={{ transition: 'fade', duration: 200 }}
			centered>
			<Text size="lg" fw={700}>{title}</Text>
			<Stack>
				<Text size="md" fw={500} mt="md" mb="md">{prompt}</Text>
				<Group justify={'center'}>
					<Tooltip label="Confirm Action" openDelay={1000} withArrow>
						<Button leftSection={<IconCheck size={18} />} aria-label="Confirm Action" onClick={onYes}>
							Yes
						</Button>
					</Tooltip>
					<Tooltip label="Cancel Action" openDelay={1000} withArrow>
						<Button leftSection={<IconX size={18} />} color="red" aria-label="Cancel Action" onClick={onNo}>
							No
						</Button>
					</Tooltip>
				</Group>
			</Stack>
		</Modal>
	);
}