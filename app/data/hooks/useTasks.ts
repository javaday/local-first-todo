import { tx } from "@instantdb/react";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { InstantContext } from "../InstantContext";
import { TaskModel } from "../models/task.model";

export const useTasks = (listId: string) => {

	const { db } = useContext(InstantContext);
	const { user } = db.useAuth();
	const [tasks, setTasks] = useState<TaskModel[]>([]);

	const userQuery = {
		tasks: {
			$: {
				where: {
					listId: listId
				}
			}
		}
	};

	const { data, error } = db.useQuery(user ? userQuery : null);

	useEffect(() => {
		if (user && data?.tasks && data.tasks.length) {
			const tasks = data.tasks.map((t: any) => new TaskModel(t));
			setTasks(tasks);
		}
		else {
			setTasks([]);
		}
	}, [user, data]);

	const commitBatch = (batch: any[]): Promise<boolean> => {
		return new Promise((resolve, reject) => {
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
				reject('A user is required.');
			}
		});
	};

	const addTask = async (model: TaskModel) => {

		if (!user) {
			return Promise.reject('A user is required.');
		}

		const data = model.getData();
		const today = dayjs().utc();

		data.listId = listId;
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

		data.listId = listId;
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
		tasks,
		addTask,
		updateTask,
		deleteTask,
	}
}