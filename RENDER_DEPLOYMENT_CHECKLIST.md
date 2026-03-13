# Render Deployment Checklist for onenowtwo.com.au

Complete this checklist to deploy your commercial real estate video production site to Render.

## ✅ Pre-Deployment (Complete)

- [x] Remove Replit dependencies
- [x] Install all npm packages
- [x] Test locally (running on http://localhost:3000)
- [x] Configure .env file
- [x] Add .gitignore for environment files
- [x] Create deployment configs (render.yaml, Dockerfile, etc.)

## 📋 Deployment Steps

### Step 1: Prepare Your Repository

```bash
# Make sure all changes are committed
git add .
git commit -m "Ready for production deployment"
git push origin main
```

**Status**: ⬜ Not started

---

### Step 2: Set Up Database (Choose One Option)

#### Option A: Neon Database (Recommended - Free Tier Available)

1. Go to [neon.tech](https://neon.tech)
2. Sign up/log in
3. Click "Create Project"
4. Settings:
   - **Name**: onenowtwo
   - **Region**: AWS Asia Pacific (Sydney) ← Important for Australia
   - **Postgres Version**: 16
5. Copy the connection string that looks like:
   ```
   postgresql://user:password@ep-xxxxx.ap-southeast-2.aws.neon.tech/onenowtwo?sslmode=require
   ```
6. Save this `DATABASE_URL` for Step 3

**Status**: ⬜ Not started

#### Option B: Render PostgreSQL

1. In your Render dashboard
2. Click "New +" → "PostgreSQL"
3. Settings:
   - **Name**: onenowtwo-db
   - **Region**: Singapore (closest to Australia)
   - **Plan**: Free
4. Click "Create Database"
5. Copy the "Internal Database URL"
6. Save this `DATABASE_URL` for Step 3

**Status**: ⬜ Not started

---

### Step 3: Generate Session Secret

Run this command in your terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output - this is your `SESSION_SECRET`

**Example output**: `a3f5d8b9c2e1f4a7b6c9d2e5f8a1b4c7d0e3f6a9b2c5d8e1f4a7b0c3d6e9f2a5`

**Status**: ⬜ Not started

---

### Step 4: Deploy to Render

1. **Go to Render Dashboard**
   - Visit [dashboard.render.com](https://dashboard.render.com)

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Click "Connect a repository"
   - Select your GitHub account
   - Find and select your `OneNowTwo` repository
   - Click "Connect"

3. **Configure Service** (Render should auto-detect from render.yaml)
   - **Name**: `onenowtwo`
   - **Region**: `Singapore` (closest to Australia)
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Plan**: Free (or select paid plan)

4. **Add Environment Variables**
   - Click "Environment" tab or scroll to "Environment Variables"
   - Add these variables:

   | Key | Value | Notes |
   |-----|-------|-------|
   | `NODE_ENV` | `production` | Required |
   | `PORT` | `5000` | Required |
   | `DATABASE_URL` | `<from Step 2>` | Your PostgreSQL connection string |
   | `SESSION_SECRET` | `<from Step 3>` | Your generated secret |

5. **Create Web Service**
   - Click "Create Web Service"
   - Render will start building and deploying
   - Wait for "Live" status (usually 2-5 minutes)

6. **Note Your Render URL**
   - You'll get a URL like: `https://onenowtwo.onrender.com`
   - Test this URL to make sure your site loads

**Status**: ⬜ Not started

---

### Step 5: Run Database Migrations

Once deployed, you need to push your database schema:

1. **In Render Dashboard**
   - Go to your `onenowtwo` web service
   - Click "Shell" in the left sidebar
   - Run: `npm run db:push`

**OR**

2. **From Your Local Machine**
   ```bash
   # Set the production DATABASE_URL temporarily
   export DATABASE_URL="<your-production-database-url>"
   npm run db:push
   ```

**Status**: ⬜ Not started

---

### Step 6: Add Custom Domain

1. **In Render Dashboard**
   - Go to your `onenowtwo` web service
   - Click "Settings" tab
   - Scroll to "Custom Domain"
   - Click "Add Custom Domain"

2. **Add Both Domains**
   - Add `onenowtwo.com.au`
   - Add `www.onenowtwo.com.au`

3. **Note the DNS Instructions**
   - Render will show you DNS records to add
   - Keep this page open for Step 7

**Status**: ⬜ Not started

---

### Step 7: Configure DNS at Your Domain Registrar

Go to where you registered `onenowtwo.com.au` (e.g., GoDaddy, Namecheap, etc.)

1. **Find DNS Settings/Management**

2. **Add CNAME Record for www**
   ```
   Type: CNAME
   Name: www
   Value: <your-app>.onrender.com (from Render dashboard)
   TTL: 3600
   ```

3. **Add A Record or ALIAS for root domain**
   
   **If ALIAS is available** (preferred):
   ```
   Type: ALIAS
   Name: @
   Value: <your-app>.onrender.com
   TTL: 3600
   ```
   
   **If only A Record is available**:
   ```
   Type: A
   Name: @
   Value: <IP address from Render>
   TTL: 3600
   ```

4. **Save Changes**

**Status**: ⬜ Not started

---

### Step 8: Enable HTTPS (Automatic)

1. **Wait for DNS Propagation** (can take 1-48 hours)
   - Check status: [dnschecker.org](https://dnschecker.org)
   - Search for `onenowtwo.com.au`

2. **Render Auto-Generates SSL Certificate**
   - Once DNS is propagated, Render automatically provisions SSL
   - Your site will be available at `https://onenowtwo.com.au`

**Status**: ⬜ Not started

---

## 🧪 Post-Deployment Testing

### Test These URLs:

- [ ] `https://onenowtwo.com.au` - Homepage loads
- [ ] `https://www.onenowtwo.com.au` - WWW subdomain works
- [ ] `https://onenowtwo.com.au/services` - Services page
- [ ] `https://onenowtwo.com.au/portfolio` - Portfolio page loads videos
- [ ] `https://onenowtwo.com.au/about` - About page
- [ ] `https://onenowtwo.com.au/enquire` - Enquiry form
- [ ] Hero video plays on homepage
- [ ] All Vimeo portfolio videos load
- [ ] Client logos display correctly
- [ ] Mobile responsive design works
- [ ] SSL certificate is valid (padlock icon)

---

## 🔍 Troubleshooting

### Site not loading?
- Check build logs in Render dashboard
- Verify environment variables are set correctly
- Check that PORT is set to 5000

### Database connection errors?
- Verify DATABASE_URL format includes `?sslmode=require`
- Check database is accessible from Render's IP range
- Try running migrations again: `npm run db:push`

### Videos not showing?
- Verify video files are in `client/public/media/` directory
- Check browser console for 404 errors
- Ensure video file names match exactly (case-sensitive)

### DNS not propagating?
- Wait longer (can take up to 48 hours)
- Clear your browser cache
- Try accessing in incognito/private mode
- Check DNS propagation: [dnschecker.org](https://dnschecker.org)

### Build fails?
- Check Node version (should be 20+)
- Verify package.json scripts are correct
- Check build logs for specific error messages

---

## 🎯 Success Checklist

Your deployment is complete when:

- [x] ✅ Code is on GitHub
- [ ] ✅ Database is set up and connected
- [ ] ✅ Site is live on Render
- [ ] ✅ Custom domain is configured
- [ ] ✅ DNS is propagated
- [ ] ✅ HTTPS is working
- [ ] ✅ All pages load correctly
- [ ] ✅ Videos play properly
- [ ] ✅ Forms work (if implemented)
- [ ] ✅ Mobile version looks good

---

## 📊 What You'll Have

**Free Tier (Render + Neon)**: $0/month
- Render Free Tier
- Neon Database Free Tier (10GB)
- Auto-SSL/HTTPS
- Automatic deployments on git push

**Paid Tier (Recommended for Production)**: ~$7-26/month
- Render Starter: $7/month (no cold starts)
- Neon Scale: $19/month (more database resources)
- Better performance and uptime

---

## 🚀 Future Updates

To update your live site after deployment:

```bash
# Make your changes locally
# Test them: npm run dev

# Commit and push
git add .
git commit -m "Update content"
git push origin main

# Render automatically redeploys (2-3 minutes)
```

---

## 📞 Support Resources

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **Neon Docs**: [neon.tech/docs](https://neon.tech/docs)
- **Your Logs**: Check Render dashboard → Logs tab

---

**Current Status**: Ready for deployment ✅

**Next Action**: Complete Step 1 (Push to GitHub)
