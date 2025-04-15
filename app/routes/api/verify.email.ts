import { type ActionFunctionArgs } from "react-router";
import { DataService } from "~/services/data/DataService";


export async function action({ request }: ActionFunctionArgs) {

	const dataService = DataService.getInstance();

	try {
		const formData = await request.formData();
		const email = formData.get('email')?.valueOf().toString() || '';

		if (email) {
			const user = await dataService.getUser({ email });

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
