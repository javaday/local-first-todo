import { Route } from "../+types/root";

const manifestData = JSON.parse(`{
	"short_name": "LocalToDo",
	"name": "Local-First ToDo",
	"description": "A local-first web application using React Router and InstantDB.",
	"icons": [
		{
			"src": "pwa-64x64.png",
			"sizes": "64x64",
			"type": "image/png"
		},
		{
			"src": "pwa-192x192.png",
			"sizes": "192x192",
			"type": "image/png"
		},
		{
			"src": "pwa-512x512.png",
			"sizes": "512x512",
			"type": "image/png"
		},
		{
			"src": "maskable-icon-512x512.png",
			"sizes": "512x512",
			"type": "image/png",
			"purpose": "maskable"
		}
	],
	"screenshots": [
		{
			"src": "RichInstallWide-640x340.png",
			"sizes": "640x340",
			"type": "image/png",
			"form_factor": "wide",
			"label": "Local-First ToDo"
		},
		{
			"src": "RichInstallNarrow-320x386.png",
			"sizes": "320x386",
			"type": "image/png",
			"form_factor": "narrow",
			"label": "Local-First ToDo"
		}
	],
	"id": "https://LocalFirstToDo.com/",
	"start_url": "https://LocalFirstToDo.com/",
	"background_color": "#ffffff",
	"display": "standalone",
	"theme_color": "#ffffff"
}`);

export async function loader({ request }: Route.LoaderArgs) {

	const environment = process.env.VERCEL_ENV || process.env.NODE_ENV;

	if (environment === 'development') {
		manifestData.id = `http://localhost:3000`;
		manifestData.start_url = `http://localhost:3000`;
	}
	else if (environment === 'preview') {
		const url = process.env.VERCEL_URL;
		manifestData.id = `https://${url}/`;
		manifestData.start_url = `https://${url}/`;
	}
	else if (environment === 'production') {
		manifestData.id = `https://www.localfirsttodo.com/`;
		manifestData.start_url = `https://www.localfirsttodo.com/`;
	}

	return new Response(JSON.stringify(manifestData), {
		headers: { 'Content-Type': 'application/manifest+json' }
	});

}