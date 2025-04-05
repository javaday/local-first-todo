import { AppShell, Burger, Center, Grid, Group, Loader, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import Logo from "~/components/core/Logo";
import { NetworkStatus } from "~/components/core/NetworkStatus";
import { AdminMenu } from "~/components/user/AdminMenu";
import { UserMenu } from "~/components/user/UserMenu";
import { UserNavigation } from "~/components/user/UserNavigation";
import { useMember } from "~/data/hooks/useMember";
import { MemberModel } from "~/data/models";
import { Role } from "~/data/models/enums";


export default function ShellLayout() {

	const [currentMember, setCurrentMember] = useState<MemberModel | null>(null);
	const [opened, { toggle }] = useDisclosure();
	const { member } = useMember();

	useEffect(() => {
		if (member) {
			setCurrentMember(member);
		}
	}, [member]);

	if (currentMember) {
		return (
			<AppShell
				header={{ height: 60 }}
				navbar={{ width: 50, breakpoint: 'sm', collapsed: { mobile: !opened } }}
				padding="md"
			>
				<AppShell.Header p="sm">
					<Grid>
						<Grid.Col span={6} py={1} px={5}>
							<Group align="center" h={'100%'}>
								<Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
								<Logo height={50} />
								<Title order={2}>Local-First Todo</Title>
							</Group>
						</Grid.Col>
						<Grid.Col span={6}>
							<Group justify="right">
								<NetworkStatus />
								{currentMember.hasRole(Role.SystemAdmin) && <AdminMenu member={currentMember} />}
								{!currentMember.hasRole(Role.SystemAdmin) && <UserMenu member={currentMember} />}
							</Group>
						</Grid.Col>
					</Grid>
				</AppShell.Header>

				<AppShell.Navbar px={3} py={5} w={75}>
					<UserNavigation member={currentMember} />
				</AppShell.Navbar>

				<AppShell.Main pl={100} pr={20} pb={20}>
					<Outlet context={{ member: currentMember }} />
				</AppShell.Main>
			</AppShell>
		);
	}
	else {
		return (
			<Center>
				<Loader color="blue" />
			</Center>
		);
	}
};