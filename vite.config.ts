import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: "Api fetch",
    },
    minify: true,
    rollupOptions: {
      external: ["@tanstack/react-query", "axios", "react"],
      output: {
        globals: {
          "@tanstack/react-query": "ReactQuery",
          axios: "axios",
          react: "React",
        },
      },
    },
  },
  resolve: { alias: { src: resolve("src/") } },
});
