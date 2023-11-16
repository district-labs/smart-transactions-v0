import path from "path"
import react from "@vitejs/plugin-react"
import dotenv from "dotenv"
import { defineConfig } from "vitest/config"

dotenv.config()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "/"),
      // "fetch": "node-fetch"
    },
    extensions: [".mjs", ".js", ".ts", ".tsx", ".json"],
  },
  test: {
    environment: "jsdom",
    include: ["**/*.test.ts", "**/*.test.tsx"],
  },
})
