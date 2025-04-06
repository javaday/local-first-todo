import { type ActionFunctionArgs } from "react-router";
import { db } from "~/services/data/instant.server";


export async function action({ request }: ActionFunctionArgs) {

	try {
		const formData = await request.formData();
		const email = formData.get('email')?.valueOf().toString() || '';

		if (email) {
			const user = await db.auth.getUser({ email });

			if (user) {
				return new Response(JSON.stringify({ verified: true }), {
					headers: { 'Content-Type': 'application/json' },
				});
			}
		}

		return new Response(JSON.stringify({ verified: false }), {
			headers: { 'Content-Type': 'application/json' },
		});
	}
	catch (e) {
		return new Response(JSON.stringify({ verified: false }), {
			headers: { 'Content-Type': 'application/json' },
			status: 500,
		});
	}
}
