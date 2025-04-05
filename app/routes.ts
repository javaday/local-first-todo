import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("login", "routes/login.tsx"),
	route("accept/:shortId", "routes/accept.tsx"),
	layout("routes/shell.tsx", [

	]),
	...prefix("api", [
		route("accept/invite", "routes/api/accept.invite.ts"),
	]),
] satisfies RouteConfig;
