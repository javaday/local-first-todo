import { tx } from "@instantdb/react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { InstantContext } from "~/data/InstantContest";
import { MemberModel } from "~/data/models/member.model";

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { showErrorNotification } from "~/utils/notification.utils";

dayjs.extend(utc);

export const useMember = () => {

	const { db } = useContext(InstantContext);
	const { isLoading, user } = db.useAuth();
	const [member, setMember] = useState<MemberModel | null>(null);
	const navigate = useNavigate();

	const userQuery = {
		members: {
			$: {
				where: {
					id: user?.id || ''
				}
			},
			user: {},
			lists: {
				tasks: {},
				invitations: {},
				members: {}
			}
		}
	};

	// Use a deferred query; isLoading will be 'true' until the query runs.
	// The query will run when user is not null.
	const { data, error } = db.useQuery(user ? userQuery : null);

	useEffect(() => {
		if (user && data?.members && data.members.length) {

			const member = new MemberModel(data.members[0]);

			member.token = user.refresh_token;
			member.signOut = () => {
				db.auth.signOut();
				setTimeout(() => {
					navigate('/login');
				}, 1000);
			};
			setMember(member);
		}
		else {
			setMember(null);
		}
	}, [user, data]);

	const updateMember = (model: MemberModel): Promise<MemberModel> => {
		return new Promise((resolve, reject) => {

			if (user) {
				const data = model.getData();
				const today = dayjs().utc();

				data.updatedAt = today.unix();
				data.updatedBy = user.id;

				const batch = [
					tx.members[data.id]
						.update(data)
				];

				db.transact(batch)
					.then(() => {
						resolve(data as MemberModel);
					})
					.catch((e) => {
						reject(e);
					});
			}
			else {
				reject('User is not logged in.');
			}
		});
	}

	const sendCode = (email: string): Promise<boolean> => {

		return new Promise((resolve, reject) => {
			db.auth.sendMagicCode({ email })
				.then(() => {
					resolve(true);
				})
				.catch((err) => {
					showErrorNotification('Magic Code Error', err);
					reject(err);
				});
		});
	}

	const verifyCode = (email: string, code: string): Promise<boolean> => {

		return new Promise((resolve, reject) => {
			db.auth.signInWithMagicCode({ email, code })
				.then(() => {
					resolve(true);
				})
				.catch((response) => {
					showErrorNotification('Verify Code Error', response.body.message);
					reject(response.body.message);
				});
		});
	}

	return {
		isLoading,
		member,
		updateMember,
		sendCode,
		verifyCode
	};
};