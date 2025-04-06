import { ActionIcon, Stack, Tooltip } from "@mantine/core";
import { IconWorld } from "@tabler/icons-react";
import { useEffect, useState, type JSX } from "react";
import { useNavigate } from "react-router";
import { MemberModel } from "~/data/models/member.model";


export interface NavLinkProps {
	icon: JSX.Element;
	label: string;
	href: string;
}

interface UserNavigationProps {
	member: MemberModel;
};

export function UserNavigation(props: UserNavigationProps) {

	const { member } = props;
	const [links, setLinks] = useState<NavLinkProps[]>([]);
	const navigate = useNavigate();

	useEffect(() => {
		const userLinks = [];

		if (member) {
			userLinks.push({
				icon: <IconWorld size={48} />,
				label: 'Organization',
				href: '/organization',
			});
		}

		setLinks(userLinks);

	}, [member]);

	return (
		<>
			{member &&
				<Stack align="center" justify="center" gap={15} pt={20}>
					{links.map((link, index) => (
						<Tooltip key={`nav-link-${index}`} label={link.label} position="right-end">
							<ActionIcon variant="transparent" size={36} onClick={() => { navigate(link.href) }}>
								{link.icon}
							</ActionIcon>
						</Tooltip>
					))}
				</Stack>
			}
		</>
	);
}