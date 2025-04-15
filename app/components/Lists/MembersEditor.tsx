import { ActionIcon, Button, Group, Stack, TextInput, Tooltip } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCheck, IconPlus, IconTrash } from "@tabler/icons-react";
import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from "react";
import { ListModel } from "~/data/models/list.model";

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { InvitationModel } from "~/data/models/invitation.model";
import { MemberModel } from "~/data/models/member.model";
import { useOnlineStatus } from "~/hooks/useOnlineStatus";
import { useListsContext } from "./Context";

dayjs.extend(utc);

interface InvitedMember {
	member: MemberModel;
	invitation: InvitationModel;
	status: string;
}

export const defaultMembersEditorProps: MembersEditorProps = {
	list: new ListModel()
};

export interface MembersEditorProps {
	list: ListModel;
}

export function MembersEditor(props: MembersEditorProps) {

	const { list } = props;
	const { inviteListMember } = useListsContext();
	const [members, setMembers] = useState<InvitedMember[]>([]);
	const [memberSegments, setMemberSegments] = useState<Record<string, InvitedMember[]>>({});
	const [view, setView] = useState('');
	const isOnline = useOnlineStatus();
	const views = ['All', 'Accepted', 'Pending', 'Expired'];

	const form = useForm({
		initialValues: {
			email: '',
		},

		initialErrors: {
			email: ''
		},

		validate: {
			email: (value) => { if (!value) return 'Email is required.'; },
		},
	});

	useEffect(() => {
		const segments: Record<string, InvitedMember[]> = {
			'Owner': [],
			'Accepted': [],
			'Pending': [],
			'Expired': []
		};

		list.members
			.forEach((member) => {

				if (member.id === list.memberId) {

					const status = 'Owner';

					const invitedMember: InvitedMember = {
						member: member,
						invitation: new InvitationModel(),
						status
					}

					segments[status].push(invitedMember);
				}
				else {
					const invitation = list.invitations.find(i => i.email === member.email);

					if (invitation) {
						const status = getInvitationStatus(invitation);

						const invitedMember: InvitedMember = {
							member: member,
							invitation: invitation,
							status: status
						}

						segments[status].push(invitedMember);
					}
				}
			});

		setMemberSegments(segments);
		setView('All');
	}, [list]);

	useEffect(() => {
		if (view === 'All') {
			const members = Object.values(memberSegments).flat();
			setMembers(members);
		}
		else {
			const members = memberSegments[view];
			setMembers(members);
		}
	}, [view, memberSegments]);


	function trySendInvite() {

		const result = form.validate();

		if (!result.hasErrors) {
			inviteListMember(list, form.values.email);
		}
	}

	function getInvitationStatus(invitation: InvitationModel) {

		const today = dayjs().utc();
		const isSent = invitation.sentAt > 0;
		const expiresAt = dayjs.unix(invitation.expiresAt).utc();
		const isExpired = invitation.expiresAt > 0 && expiresAt.isBefore(today);

		if (isSent && isExpired) {
			return 'Expired';
		}
		else if (isSent && invitation.acceptedAt > 0) {
			return 'Accepted';
		}
		else {
			return 'Pending';
		}
	}

	function confirmDelete(model: InvitedMember) {
		// setConfirmDialogProps({
		// 	opened: true,
		// 	prompt: `Are you sure you want to remove '${model.member.name}'?`,
		// 	onYes: () => deleteOrgTeam(model),
		// 	onNo: () => { setConfirmDialogProps({ ...confirmDialogProps, opened: false }) }
		// });
	}

	function handleKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key === 'Enter') {
			trySendInvite();
		}
	};


	return (
		<Stack gap={10}>
			{isOnline &&
				<Group gap={5} p={0}>
					<IconPlus size={16} />
					<TextInput
						variant="unstyled"
						key={form.key('email')}
						placeholder="Email"
						value={form.values.email}
						onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
						onKeyUp={handleKeyUp}
					/>
				</Group>
			}
			<DataTable
				idAccessor="member.id"
				withTableBorder
				borderRadius="sm"
				withColumnBorders
				striped
				highlightOnHover
				noRecordsText="No Members"
				// provide data
				records={members}
				// define columns
				columns={[
					{
						accessor: 'member.name',
						title: 'Name',
					},
					{
						accessor: 'member.email',
						title: 'Email',
					},
					{
						accessor: 'invitation',
						title: 'Status',
						render: (record: InvitedMember) => record.status,
						filter: ({ close }) => (
							<Stack gap={0}>
								{views.map((v, index) => (
									<Button key={`status-filter-${index}`} leftSection={v === view ? <IconCheck size={14} /> : undefined} variant="transparent" px={0} justify="flex-start" onClick={() => { setView(v); close(); }}>{v}</Button>
								))}
							</Stack>
						),
						filtering: view !== 'All',
						width: 150,
					},
					{
						accessor: 'actions',
						title: '',
						render: (record: InvitedMember) => {
							if (record.status === 'Owner') {
								return (<></>);
							}
							else {
								return (
									<Tooltip label='Remove Member' withArrow>
										<ActionIcon
											size="sm"
											variant="subtle"
											color="red"
											onClick={() => confirmDelete(record)}
										>
											<IconTrash size={16} />
										</ActionIcon>
									</Tooltip>
								);
							}
						},
						width: 75,
					}
				]}
			/>
		</Stack>
	);
}