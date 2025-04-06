import { Avatar, Menu, rem, useMantineColorScheme } from "@mantine/core";
import { IconColorFilter, IconDoorExit } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { MemberModel } from "~/data/models/member.model";
import { useOnlineStatus } from "~/hooks/useOnlineStatus";

interface UserMenuProps {
	member: MemberModel;
}

export function UserMenu(props: UserMenuProps) {

	const { member } = props;
	const [initials, setInitials] = useState('');
	const online = useOnlineStatus();

	useEffect(() => {
		if (member) {

			const name = `${member.firstName} ${member.lastName}`.trim() || member.name || '';

			if (name.length) {
				const names = name.split(' ')
				const firstInit = names[0].charAt(0).toUpperCase();
				const lastInit = names.length > 1 ? names.reverse()[0].charAt(0).toUpperCase() : '';

				setInitials(`${firstInit}${lastInit}`);
			}
		}
	}, [member]);

	const { toggleColorScheme } = useMantineColorScheme();

	const signOut = () => {
		member ? member.signOut() : () => { };
	}

	return (
		<>
			{member &&
				< Menu withArrow width={200}>
					<Menu.Target>
						<Avatar src={member.avatarUrl} alt={member.email} color="red">
							{initials}
						</Avatar>
					</Menu.Target>
					<Menu.Dropdown>
						<Menu.Label>Application</Menu.Label>
						<Menu.Item
							leftSection={<IconColorFilter style={{ width: rem(14), height: rem(14) }} />}
							onClick={() => { toggleColorScheme(); }}
						>
							Toggle Color Scheme
						</Menu.Item>
						<Menu.Divider />
						<Menu.Label>Account</Menu.Label>
						<Menu.Item
							leftSection={<IconDoorExit style={{ width: rem(14), height: rem(14) }} />}
							onClick={signOut}
						>
							Sign Out
						</Menu.Item>
					</Menu.Dropdown>
				</Menu >
			}
		</>
	);
}