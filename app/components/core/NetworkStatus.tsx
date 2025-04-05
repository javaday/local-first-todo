import { IconWifiOff } from "@tabler/icons-react";
import { useOnlineStatus } from "~/hooks/useOnlineStatus";


export const NetworkStatus = () => {

	const online = useOnlineStatus();

	if (online) {
		return (
			<></>
		);
	}
	else {
		return (
			<IconWifiOff color="red" />
		);
	}
};