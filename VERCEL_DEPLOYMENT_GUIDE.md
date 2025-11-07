# 🚀 Panduan Deploy ke Vercel - frons.id

## 📋 Prasyarat

- ✅ Repository GitHub: https://github.com/whixz123/frons
- ✅ Akun Vercel (https://vercel.com)
- ✅ Node.js 18+ installed locally

---

## 🎯 Langkah Deploy ke Vercel

### 1️⃣ Import Project di Vercel

1. Login ke [Vercel Dashboard](https://vercel.com/dashboard)
2. Klik **"Add New Project"**
3. Pilih **"Import Git Repository"**
4. Pilih repository: `whixz123/frons`
5. Klik **"Import"**

### 2️⃣ Configure Project Settings

**PENTING:** Karena Next.js app berada di subfolder `web/`, set konfigurasi berikut:

#### Framework Preset
- **Framework:** Next.js

#### Build & Development Settings
- **Root Directory:** `web` ⚠️ PENTING!
- **Build Command:** `npm run build` (default OK)
- **Output Directory:** `.next` (default OK)
- **Install Command:** `npm install` (default OK)

#### Environment Variables (Optional)
Tambahkan di Vercel Dashboard → Settings → Environment Variables:

```bash
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=95eTYR6AW9u7RExdHmZwr7LuLbgZM83aqAUkEFV5me89
```

### 3️⃣ Deploy

1. Klik **"Deploy"**
2. Tunggu build process (~2-3 menit)
3. ✅ Selesai! App akan tersedia di URL Vercel Anda

---

## 🔧 Troubleshooting Common Issues

### ❌ Error: "No such file or directory: package.json"
**Solusi:** Pastikan **Root Directory** di Vercel settings = `web`

### ❌ Error: "Module not found"
**Solusi:** 
- Clear deployment cache di Vercel
- Redeploy

### ❌ Error: "Build exceeded maximum duration"
**Solusi:**
- Upgrade Vercel plan (jika perlu)
- Atau optimize dependencies

### ❌ Error 404 saat mengakses routes
**Solusi:**
- Check `vercel.json` sudah ada di root folder
- Ensure `rootDirectory: "web"` configured

---

## 📁 Struktur Folder yang Benar

```
frons/                          # Root repository
├── vercel.json                 # ✅ Vercel config (root level)
├── programs/                   # Solana programs
├── web/                        # ⭐ Next.js app (ROOT DIRECTORY)
│   ├── .env.example           # Environment template
│   ├── .env.local             # Local env (tidak di commit)
│   ├── .npmrc                 # NPM config
│   ├── next.config.js         # ✅ Optimized untuk Vercel
│   ├── package.json
│   ├── tsconfig.json
│   ├── app/                   # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx          # Homepage
│   │   ├── gamefi/
│   │   ├── wfc/
│   │   └── workspace/
│   ├── components/            # React components
│   └── public/                # Static assets
└── README.md
```

---

## 🌐 Routes yang Tersedia

Setelah deploy, routes berikut akan accessible:

- **`/`** - Homepage dengan Pomodoro Timer
- **`/gamefi`** - GameFi Dashboard (original)
- **`/gamefi-new`** - GameFi Dashboard (new version)
- **`/wfc`** - Work-from-Coffee Workspace
- **`/workspace`** - Alternative workspace view

---

## ✅ Checklist Pre-Deploy

- [x] `vercel.json` ada di root folder
- [x] Root Directory = `web` di Vercel settings
- [x] `.npmrc` tidak menggunakan China mirror
- [x] `next.config.js` optimized
- [x] All dependencies installed
- [x] Build berhasil locally (`npm run build`)
- [x] No TypeScript errors
- [x] No ESLint errors (atau hanya warnings)

---

## 🔄 Auto-Deploy Setup

Setelah initial deploy, setiap `git push` ke branch `main` akan otomatis trigger deployment baru di Vercel.

```bash
# Make changes
git add .
git commit -m "Your commit message"
git push origin main

# Vercel akan otomatis deploy! 🚀
```

---

## 📊 Monitoring

Setelah deploy, monitor aplikasi di:

1. **Vercel Dashboard** → Your Project → Deployments
2. **Vercel Analytics** (jika enabled)
3. **Vercel Logs** untuk debugging

---

## 🆘 Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Solana Web3.js Docs](https://solana-labs.github.io/solana-web3.js/)

---

## 🎉 Success Indicators

Build berhasil jika:
- ✅ Build logs menunjukkan "Build Completed"
- ✅ Semua routes (/, /gamefi, /wfc, dll) accessible
- ✅ No 404 errors
- ✅ Wallet adapter loading
- ✅ UI rendering correctly

**Selamat! Aplikasi Anda sudah live di Vercel! 🎊**
