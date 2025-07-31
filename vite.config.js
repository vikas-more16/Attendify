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
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries into separate chunks
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/analytics', 'firebase/firestore'],
          ui: ['bootstrap', 'react-icons'],
          utils: ['axios', 'papaparse'],
        },
      },
    },
    // Use esbuild minification instead of terser
    minify: 'esbuild',
    // Enable source maps for debugging
    sourcemap: false,
    // Optimize CSS
    cssCodeSplit: true,
    // Enable chunk size optimization
    chunkSizeWarningLimit: 1000,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      'firebase/app',
      'firebase/auth',
      'firebase/analytics',
      'firebase/firestore',
      'bootstrap',
      'react-icons',
    ],
  },
  // Enable experimental features for better performance
  experimental: {
    renderBuiltUrl: true,
  },
});
