import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

const root = resolve(__dirname);

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: [resolve(root, "src/test/setup.ts")],
    root,
  },
  resolve: {
    alias: {
      "@": resolve(root, "src"),
    },
  },
});
