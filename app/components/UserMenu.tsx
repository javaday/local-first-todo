import { Avatar, Menu, rem, useMantineColorScheme } from "@mantine/core";
import { IconColorFilter, IconDoorExit, IconUserPlus } from "@tabler/icons-react";
import { useState } from "react";
import { Role } from "~/data/models/enums";
import { MemberModel } from "~/data/models/member.model";
import { useOnlineStatus } from "~/hooks/useOnlineStatus";
import { defaultInviteMemberDialogProps, InviteMemberDialog, InviteMemberDialogProps } from "./InviteMemberDialog";

interface UserMenuProps {
	member: MemberModel;
}

export function UserMenu(props: UserMenuProps) {

	const { member } = props;
	const [initials, setInitials] = useState('');
	const [inviteDialogProps, setInviteDialogProps] = useState<InviteMemberDialogProps>(defaultInviteMemberDialogProps);
	const online = useOnlineStatus();

	const { toggleColorScheme } = useMantineColorScheme();

	const signOut = () => {
		member ? member.signOut() : () => { };
	}

	function inviteMember() {
		setInviteDialogProps({
			opened: true,
			member: member,
			onCancel: () => { setInviteDialogProps(defaultInviteMemberDialogProps); }
		});
	}

	return (
		<>
			<InviteMemberDialog {...inviteDialogProps} />
			{member &&
				< Menu withArrow width={200}>
					<Menu.Target>
						<Avatar src={member.avatarUrl} alt={member.email} color="red">
							{member.initials}
						</Avatar>
					</Menu.Target>
					<Menu.Dropdown>
						<Menu.Label>Application</Menu.Label>
						{member.role === Role.SystemAdmin && online &&
							<Menu.Item
								leftSection={<IconUserPlus style={{ width: rem(14), height: rem(14) }} />}
								onClick={() => { inviteMember(); }}
							>
								Invite Member
							</Menu.Item>
						}
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