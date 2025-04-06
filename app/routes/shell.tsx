import { AppShell, Burger, Center, Grid, Group, Stack, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { default as Logo } from "~/components/Logo";
import { MagicCode } from "~/components/MagicCode";
import { NetworkStatus } from "~/components/NetworkStatus";
import { UserMenu } from "~/components/UserMenu";
import { UserNavigation } from "~/components/UserNavigation";
import { useMember } from "~/data/hooks/useMember";
import { MemberModel } from "~/data/models/member.model";


export default function ShellLayout() {

	const [currentMember, setCurrentMember] = useState<MemberModel | null>(null);
	const [opened, { toggle }] = useDisclosure();
	const { member } = useMember();

	useEffect(() => {
		if (member) {
			setCurrentMember(member);
		}
	}, [member]);

	return (
		<AppShell
			header={{ height: 60 }}
			navbar={{ width: 50, breakpoint: 'sm', collapsed: { mobile: !opened } }}
			padding="md"
		>
			{currentMember &&
				<>
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
									<UserMenu member={currentMember} />
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
				</>
			}
			{!currentMember &&
				<AppShell.Main pl={20} pr={20} pb={20}>
					<Center pt={20}>
						<Stack gap={5} align={'center'}>
							<Logo height={150} />
							<Text className={'lilita-one-regular'}>Local-First ToDo</Text>
							<MagicCode />
						</Stack>
					</Center >
				</AppShell.Main>
			}
		</AppShell>
	);
};