import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  base: "./",
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 5173,
    hmr: {
      protocol: process.env.NGROK_HTTPS === "1" ? "wss" : "ws",
      host: process.env.NGROK_HOST || undefined,
      clientPort: process.env.NGROK_CLIENT_PORT ? Number(process.env.NGROK_CLIENT_PORT) : undefined,
    },
    allowedHosts: true,
  },
});
