/// <reference types="vitest" />
/// <reference types="vite/client" />
import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react()],
	test: {
		globals: true,
		environment: "jsdom",
	},
	build: {
		lib: {
			entry: path.resolve(__dirname, "src/lib/index.ts"),
			name: "Buidl",
			formats: ["es", "umd"],
			fileName: (format) => `buidl.${format}.js`,
		},
		rollupOptions: {
			external: ["react", "react-dom"],
			output: {
				globals: {
					react: "React",
					"react-dom": "ReactDOM",
				},
			},
		},
	},
});
