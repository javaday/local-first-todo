import { tx } from "@instantdb/react";
import { useContext } from "react";
import { InstantContext } from "~/data/InstantContext";
import { ListModel } from "../models/list.model";
import { TaskModel } from "../models/task.model";

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { toError } from "~/utils/error.utils";

dayjs.extend(utc);

export const useLists = () => {

	const { db } = useContext(InstantContext);
	const { user } = db.useAuth();

	const commitBatch = (batch: any[]): Promise<boolean> => {
		return new Promise((resolve, reject) => {
			try {
				if (user) {
					db.transact(batch)
						.then(() => {
							resolve(true);
						})
						.catch((e) => {
							reject(e);
						});
				}
				else {
					throw new Error('A user is required.');
				}
			}
			catch (e) {
				const error = toError(e);
				reject(error);
			}
		});
	};

	const addList = async (model: ListModel) => {

		if (!user) {
			return Promise.reject('A user is required.');
		}

		const data = model.getData();
		const today = dayjs().utc();

		data.memberId = user.id;
		data.createdAt = today.unix();
		data.createdBy = user.id;

		const batch = [
			tx.lists[data.id]
				.update(data),
			tx.members[user.id]
				.link({
					lists: data.id // link to member
				})
		];

		return commitBatch(batch);
	};

	const updateList = async (model: ListModel) => {

		if (!user) {
			return Promise.reject('A user is required.');
		}

		const data = model.getData();
		const today = dayjs().utc();

		data.updatedAt = today.unix();
		data.updatedBy = user?.id;

		const batch = [
			tx.lists[data.id]
				.update(data)
		];

		return commitBatch(batch);
	};

	const deleteList = async (model: ListModel) => {

		if (!user) {
			return Promise.reject('A user is required.');
		}

		const batch = [
			tx.lists[model.id]
				.delete()
		];

		return commitBatch(batch);
	};

	const addTask = async (model: TaskModel) => {

		if (!user) {
			return Promise.reject('A user is required.');
		}

		const data = model.getData();
		const today = dayjs().utc();

		data.createdAt = today.unix();
		data.createdBy = user?.id || '';

		const batch = [
			tx.tasks[data.id]
				.update(data)
				.link({
					list: data.listId // link to list
				})
		];

		return commitBatch(batch);
	};

	const updateTask = async (model: TaskModel) => {

		if (!user) {
			return Promise.reject('A user is required.');
		}

		const data = model.getData();
		const today = dayjs().utc();

		data.updatedAt = today.unix();
		data.updatedBy = user?.id;

		const batch = [
			tx.tasks[data.id]
				.update(data)
		];

		return commitBatch(batch);
	};

	const deleteTask = async (model: TaskModel) => {

		if (!user) {
			return Promise.reject('A user is required.');
		}

		const batch = [
			tx.tasks[model.id]
				.delete()
		];

		return commitBatch(batch);
	};

	return {
		addList,
		updateList,
		deleteList,
		addTask,
		updateTask,
		deleteTask
	};
};