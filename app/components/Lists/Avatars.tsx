import { Avatar, Tooltip } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { InstantContext } from "~/data/InstantContest";
import { ListModel } from "~/data/models/list.model";
import { MemberModel } from "~/data/models/member.model";

interface AvatarsProps {
	list: ListModel,
	member: MemberModel
};

export function Avatars(props: AvatarsProps) {

	const { list, member } = props;
	const { db } = useContext(InstantContext);
	const [onlinePeers, setOnlinePeers] = useState<string[]>([]);
	const room = db.room('list', list.id);
	const { user: myPresence, peers, publishPresence } = db.rooms.usePresence(room);

	useEffect(() => {
		publishPresence({ memberId: member.id });
	}, []);

	useEffect(() => {
		if (myPresence) {
			setOnlinePeers([
				myPresence.memberId,
				...Object.values(peers).map((peer) => peer.memberId)
			]);
		}
		else {
			setOnlinePeers([]);
		}
	}, [myPresence, peers]);

	const avatar = (member: MemberModel) => {

		const isOwner = member.id === list.memberId;
		const isOnline = onlinePeers.includes(member.id) ? true : false;

		return (
			<Tooltip withArrow key={member.id} label={isOwner ? `${member.name} (Owner)` : member.name}>
				<Avatar src={member.avatarUrl} alt={member.email} color={isOnline ? 'blue' : 'red'}>
					{member.initials}
				</Avatar>
			</Tooltip>
		);
	};

	if (list.members.length > 3) {
		return (
			<Tooltip.Group openDelay={300} closeDelay={100}>
				<Avatar.Group spacing="sm">
					{
						list.members.slice(0, 2).map((member) => avatar(member))
					}
					{
						<Tooltip withArrow label={
							list.members.slice(3).map((member) => (
								<div key={member.id}>{member.name}</div>
							))
						}>
							<Avatar>
								{`+${list.members.length - 3}`}
							</Avatar>
						</Tooltip>
					}
				</Avatar.Group>
			</Tooltip.Group>
		);
	}
	else {
		return (
			<Tooltip.Group openDelay={300} closeDelay={100}>
				<Avatar.Group spacing="sm">
					{
						list.members.map((member) => avatar(member))
					}
				</Avatar.Group>
			</Tooltip.Group>
		);
	}
}