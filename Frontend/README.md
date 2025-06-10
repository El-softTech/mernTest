# 📝 MERN To-Do List

Proyek **To-Do List** sederhana menggunakan **MERN Stack** (MongoDB, Express, React, Node.js). Aplikasi ini memungkinkan pengguna untuk menambahkan, mengedit, dan menghapus to-do.

## 🚀 Fitur
- ✅ Tambah to-do baru
- ✏️ Edit to-do
- 🗑️ Hapus to-do
- 📌 Simpan data di database MongoDB

## 🏗️ Teknologi yang Digunakan
- **Frontend:** React + Vite, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **State Management:** useState, useEffect

## Langkah Langkah
- instal vite dengan pnpm 
    pnpm create vite(ikutin langkah langkah nya sampain pnpm install)
- install tailwindcss untuk css library nya
    pnpm add -D tailwindcss@3.4.17 postcss autoprefixer
    npx tailwindcss@3.4.17 init -p
 
 - edit beberpa file seperti tailwind.config.js
    /** @type {import('tailwindcss').Config} */
    export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], 
    theme: {
     extend: {},
    },
  plugins: [],
    }

    content harus di isi = "./index.html", "./src/**/*.{js,ts,jsx,tsx}"

 - edit postcss.config.js
    export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
        },
    }
    
- edit index.css dengan
    @tailwind base;
    @tailwind components;
    @tailwind utilities;



