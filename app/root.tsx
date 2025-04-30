import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from '@mantine/notifications';
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { InstantContextProvider } from "~/data/InstantContest";
import type { Route } from "./+types/root";
import faviconAssetUrl from './assets/logo.svg';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import 'mantine-datatable/styles.css';
import "./app.css";

export const meta: Route.MetaFunction = () => {
	return [
		{
			title: "Local-First ToDo"
		},
		{
			name: "description",
			content: "A local-first web application using React Router and InstantDB.",
		},
		{
			name: "viewport",
			content: "width=device-width, initial-scale=1.0",
		},
		{
			name: "theme-color",
			content: "#ffffff",
		},
		{
			name: "mobile-web-app-capable",
			content: "yes",
		},
		{
			name: "apple-mobile-web-app-capable",
			content: "yes",
		}
	];
}

export const links: Route.LinksFunction = () => [
	{
		rel: 'icon',
		type: 'image/svg+xml',
		href: faviconAssetUrl
	},
	{
		rel: 'manifest',
		href: 'manifest',
		crossOrigin: 'use-credentials'
	},
	{
		rel: 'apple-touch-icon',
		href: 'apple-touch-icon-180x180.png',
	},
	{
		rel: 'msapplication-TileImage',
		href: 'pwa-192x192.png',
	},
	{
		rel: "preconnect",
		href: "https://fonts.googleapis.com"
	},
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Lilita+One&display=swap",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Roboto:wght@100..900&display=swap",
	},
];

export function Layout({ children }: { children: React.ReactNode }) {

	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<Meta />
				<Links />
			</head>
			<body>
				<MantineProvider>
					<Notifications />
					<ModalsProvider>
						<InstantContextProvider>
							{children}
						</InstantContextProvider>
					</ModalsProvider>
				</MantineProvider>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return (
		<Outlet />
	);
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = "Oops!";
	let details = "An unexpected error occurred.";
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "404" : "Error";
		details =
			error.status === 404
				? "The requested page could not be found."
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main className="pt-16 p-4 container mx-auto">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full p-4 overflow-x-auto">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	);
}
