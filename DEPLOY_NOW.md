# 🚀 Deploy to Render NOW - Quick Guide

Your site is **ready to deploy**! Follow these steps to get `onenowtwo.com.au` live.

---

## ⚡ Fast Track (30 minutes)

### 1️⃣ Push to GitHub (2 minutes)

```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

### 2️⃣ Set Up Database (5 minutes)

**Go to [neon.tech](https://neon.tech)**

1. Sign up (free)
2. Create Project → Name: `onenowtwo` → Region: **Sydney**
3. Copy the connection string (starts with `postgresql://`)

### 3️⃣ Deploy on Render (10 minutes)

**Go to [render.com](https://render.com)**

1. New + → Web Service
2. Connect your GitHub repo
3. Render auto-detects settings from `render.yaml`
4. Add these environment variables:
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `DATABASE_URL` = `<paste from step 2>`
   - `SESSION_SECRET` = `<run command below>`

**Generate SESSION_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

5. Click "Create Web Service"
6. Wait for "Live" status (3-5 mins)

### 4️⃣ Add Your Domain (5 minutes)

**In Render Dashboard:**

1. Settings → Custom Domain
2. Add `onenowtwo.com.au` and `www.onenowtwo.com.au`
3. Copy the DNS instructions

**At Your Domain Registrar:**

Add these DNS records:
```
CNAME: www → <your-app>.onrender.com
ALIAS: @ → <your-app>.onrender.com
(or A record if ALIAS not available)
```

### 5️⃣ Wait for DNS (1-48 hours)

- DNS propagation takes time
- Check: [dnschecker.org](https://dnschecker.org)
- Render auto-enables HTTPS when ready

---

## ✅ That's It!

Your site will be live at:
- `https://onenowtwo.com.au`
- `https://www.onenowtwo.com.au`

---

## 🎬 What You're Deploying

- ✅ Full React/TypeScript frontend
- ✅ Express backend API
- ✅ PostgreSQL database
- ✅ Commercial real estate portfolio
- ✅ Vimeo video integrations
- ✅ Client logos (JLL, CBRE, Rydges, etc.)
- ✅ Contact form ready
- ✅ Mobile responsive
- ✅ Auto-SSL/HTTPS
- ✅ Monochrome design system

---

## 📊 Cost

**Free Tier**: $0/month
- Render Free (sleeps after 15 min inactivity)
- Neon Free (10GB database)

**Recommended**: $7/month
- Render Starter (no sleep, better performance)
- Neon Free (still free)

---

## 🆘 Need Help?

Full detailed guide: See `RENDER_DEPLOYMENT_CHECKLIST.md`

Common issues:
- **Build fails**: Check Node version in Render (should be 20+)
- **Videos not loading**: They're in the right place ✅
- **Database errors**: Check DATABASE_URL includes `?sslmode=require`

---

**Your current local site**: http://localhost:3000 ✅ Working!

**Ready to deploy?** Start with Step 1 above ⬆️
