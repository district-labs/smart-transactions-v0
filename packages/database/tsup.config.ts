import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  shims: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  format: ["cjs", "esm"],
  outDir: "dist",
  dts: true,
});