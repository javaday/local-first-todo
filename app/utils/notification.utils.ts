import { type NotificationData, notifications } from "@mantine/notifications";

export const showInfoNotification = (title: string, message: string) => {
	showNotification({
		withCloseButton: true,
		withBorder: true,
		autoClose: true,
		title,
		message,
		color: 'blue',
		loading: false,
	});
};

export const showSuccessNotification = (title: string, message: string) => {
	showNotification({
		withCloseButton: true,
		withBorder: true,
		autoClose: true,
		title,
		message,
		color: 'green',
		loading: false,
	});
};

export const showErrorNotification = (title: string, message: string) => {
	showNotification({
		withCloseButton: true,
		withBorder: true,
		autoClose: false,
		title,
		message,
		color: 'red',
		loading: false,
	});
};

export const showNotification = (notification: NotificationData) => {
	notifications.show(notification);
}