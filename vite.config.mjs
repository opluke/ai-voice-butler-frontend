import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/ai-voice-butler-frontend/",   // ⭐ GitHub Pages 路徑
  plugins: [react()],
});
