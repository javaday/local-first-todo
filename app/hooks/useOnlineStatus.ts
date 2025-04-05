import { useSyncExternalStore } from 'react';

export const useOnlineStatus = () => {

	const isOnline = useSyncExternalStore(
		(callback) => {
			window.addEventListener('online', callback);
			window.addEventListener('offline', callback);
			return () => {
				window.removeEventListener('online', callback);
				window.removeEventListener('offline', callback);
			};
		},
		() => navigator.onLine, // get client snapshot
		() => true // get server snapshot
	);

	return isOnline;
};
