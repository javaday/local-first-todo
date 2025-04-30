/// <reference types="vitest/config" />

import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ isSsrBuild, command }) => ({
	build: {
		rollupOptions: isSsrBuild
			? {
				input: "./server/app.ts",
			}
			: undefined,
	},
	plugins: [
		reactRouter(),
		tsconfigPaths(),
	],
	resolve: {
		alias: {
			// /esm/icons/index.mjs only exports the icons statically, so no separate chunks are created
			'@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
		},
	},
	ssr: {
		noExternal: command === "build" ? true : undefined,
	},
	test: {
		environment: 'jsdom'
	},
}));
