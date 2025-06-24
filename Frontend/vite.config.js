import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Mendengarkan semua alamat
    allowedHosts: [
      '2c0f-103-47-133-189.ngrok-free.app', // Domain Ngrok spesifik Anda
      '.ngrok-free.app' ,
      'soup-refused-nm-office.trycloudflare.com',
       '.repl.co'
      
    ],
    // hmr: {
    //   clientPort: 443 // Untuk koneksi HTTPS Ngrok
    // }
  }
})