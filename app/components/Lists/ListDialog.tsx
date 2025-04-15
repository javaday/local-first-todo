import { Modal } from "@mantine/core";
import { useScreenInfo } from "~/hooks/useScreenInfo";
import { useListsContext } from "./Context";

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';


dayjs.extend(utc);

export interface ListDialogProps {
	opened: boolean;
	title: string;
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'auto';
	children: React.ReactNode;
}

export const defaultDialogProps: ListDialogProps = {
	opened: false,
	title: '',
	children: <></>,
};


export function ListDialog(props: ListDialogProps) {

	const { opened, children, title, size = 'auto' } = props;
	const { closeDialog } = useListsContext();
	const { isSmall } = useScreenInfo();

	return (
		<Modal
			opened={opened}
			onClose={closeDialog}
			title={title}
			withCloseButton={true}
			transitionProps={{ transition: 'fade', duration: 200 }}
			size={size}
			centered={!isSmall}
			fullScreen={isSmall}>
			{children}
		</Modal>
	);
}