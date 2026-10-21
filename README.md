# Sharing Vision Frontend

Dashboard React untuk tes Sharing Vision. Aplikasi menampilkan artikel pada tab Published, Drafts, dan Trashed; menyediakan editor; serta preview artikel publish dengan pagination.

## Prasyarat

- Node.js 24+
- npm
- Backend Sharing Vision berjalan pada `http://localhost:8080` atau URL API yang dapat diakses browser

## Konfigurasi

Salin `.env.example` menjadi `.env` dan atur alamat API:

```env
VITE_API_URL=http://localhost:8080
```

## Jalankan aplikasi

```powershell
npm ci
npm run dev
```

Buka alamat yang ditampilkan Vite, biasanya `http://localhost:5173`.

## Build produksi

```powershell
npm run build
```

Hasil build akan dibuat pada folder `dist/`, yang sengaja tidak di-commit.

## Deploy demo online: Render Static Site

1. Deploy backend terlebih dahulu dan salin URL API Render, misalnya `https://sharing-vision-api.onrender.com`.
2. Di Render, pilih **New > Static Site**, lalu hubungkan repository frontend ini.
3. Isi konfigurasi berikut:

   ```text
   Build command: npm ci && npm run build
   Publish directory: dist
   ```

4. Tambahkan environment variable build berikut, lalu lakukan deploy:

   ```env
   VITE_API_URL=https://sharing-vision-api.onrender.com
   ```

Render akan menghasilkan URL demo publik. Bila URL API diubah, perbarui `VITE_API_URL` dan deploy ulang frontend karena Vite memasukkan nilai tersebut saat build.
