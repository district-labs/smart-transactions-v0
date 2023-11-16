import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  shims: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: true,
  dts: true,
  format: ["cjs", "esm"],
  outDir: "dist",
});
