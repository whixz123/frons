# ⚡ Quick Vercel Setup - frons.id

## 🚨 PENTING: Setting Root Directory

**Error 404 terjadi karena Next.js app berada di subfolder `web/`**

### ✅ Cara Fix di Vercel Dashboard:

**Saat Import Project Pertama Kali:**

1. Go to: **Vercel Dashboard** → **Add New Project** → **Import Git Repository**

2. Select repository: `whixz123/frons`

3. **Configure Project:**
   - Click **"Edit"** pada bagian **Root Directory**
   - Set value: **`web`** ⚠️ CRITICAL!
   - Framework Preset: **Next.js** (auto-detected)
   - Build Command: `npm run build` (leave default)
   - Output Directory: `.next` (leave default)
   - Install Command: `npm install` (leave default)

4. Click **"Deploy"**

**Jika Sudah Deploy Tapi Error 404:**

1. Go to: **Vercel Dashboard** → **Your Project** → **Settings** → **General**

2. Scroll ke **"Root Directory"**

3. Klik **"Edit"**

4. Set value: **`web`**

5. Klik **"Save"**

6. Go to **"Deployments"** → Klik **"Redeploy"** pada deployment terakhir

---

## 📋 One-Time Vercel Configuration

### Step-by-Step:

#### 1. Import Project
```
Vercel Dashboard → Add New Project
→ Import from GitHub
→ Select: whixz123/frons
```

#### 2. Configure Build Settings

**CRITICAL - Set Root Directory:**

![Vercel Root Directory Setting](https://docs.vercel.com/docs/concepts/git/monorepos#configuring-the-root-directory)

```
Framework Preset: Next.js (auto-detected)
Root Directory: web              ← 🚨 MUST SET THIS!
Build Command: npm run build     (default)
Output Directory: .next          (default)
Install Command: npm install     (default)
```

**CATATAN:** Tidak perlu `vercel.json` file. Vercel akan auto-detect dengan Root Directory setting.

#### 3. Environment Variables (Optional)
```bash
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=95eTYR6AW9u7RExdHmZwr7LuLbgZM83aqAUkEFV5me89
```

#### 4. Deploy!
Click **"Deploy"** and wait ~2 minutes

---

## ✅ Checklist

- [ ] Root Directory = `web` ✅ CRITICAL!
- [ ] Framework = Next.js
- [ ] Auto-deploy on git push enabled
- [ ] Domain configured (optional)

---

## 🔄 Auto Deploy

After setup, every push to `main` branch will auto-deploy:

```bash
git add .
git commit -m "your changes"
git push origin main
# Vercel will auto-deploy! 🚀
```

---

## 🌐 Your Live URL

After deployment, your app will be available at:
```
https://your-project-name.vercel.app
```

All routes will work:
- `/` - Homepage
- `/gamefi` - GameFi Dashboard  
- `/wfc` - Workspace
- `/workspace` - Alt Workspace

---

## 🆘 Still Getting 404?

1. **Check Root Directory** in Vercel Settings
2. **Clear Deployment Cache**: Settings → General → Clear Cache
3. **Redeploy**: Deployments → Latest → Redeploy

---

**That's it! Your app should now be live! 🎉**

For detailed guide, see: [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)
