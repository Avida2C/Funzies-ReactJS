import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      ignored: [
        "**/server/**",
        "**/server/data/**",
        "**/dist/**",
        "**/.git/**",
        "**/node_modules/**",
      ],
    },
    proxy: {
      "/api": {
        target: "http://localhost:3007",
        changeOrigin: true,
      },
    },
  },
});
