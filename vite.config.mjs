import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "/ai-voice-butler-frontend/",  // ⭐ 新 repo 名稱
})
