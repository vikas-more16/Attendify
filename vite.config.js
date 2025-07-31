import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: process.env.PORT || 5173,
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    host: "0.0.0.0",
    port: process.env.PORT || 4173,
    allowedHosts: [
      "attendify.in.net", // ✅ add this line
    ],
  },
  build: {
    chunkSizeWarningLimit: 1000,
  },
});
