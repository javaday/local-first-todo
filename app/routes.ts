import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
	route("login", "routes/login.tsx"),
	route("accept/:shortId", "routes/accept.tsx"),
	layout("routes/shell.tsx", [
		index("routes/index.tsx"),
		route("lists", "routes/lists.tsx")
	]),
	...prefix("api", [
		route("verify/email", "routes/api/verify.email.ts"),
		route("invite/member", "routes/api/invite.member.ts"),
		route("invite/list/member", "routes/api/invite.list.member.ts"),
		route("accept/invite", "routes/api/accept.invite.ts"),
	]),
] satisfies RouteConfig;
