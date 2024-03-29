import { defineConfig } from "vite";

import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [dts()],
  build: {
    target: "esnext",
    minify: true,
    lib: {
      entry: ["src/index.ts", "src/lite.ts"],
      formats: ["cjs", "es"],
    },
    rollupOptions: {
      external: [],
    },
  },
});
