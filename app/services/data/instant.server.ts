import { init } from "@instantdb/admin";
import type { AppSchema } from 'instant.schema';

const db = init<AppSchema>({
	appId: process.env.VITE_INSTANT_APP_ID!,
	adminToken: process.env.INSTANT_APP_ADMIN_TOKEN!,
});

export { db };
