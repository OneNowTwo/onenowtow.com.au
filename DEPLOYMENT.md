# Deployment Guide for onenowtwo.com.au

This guide covers deploying One Now Two (commercial real estate video production site) to production hosting at onenowtwo.com.au.

## Pre-Deployment Checklist

- [ ] Code is committed to Git repository (GitHub, GitLab, etc.)
- [ ] Production database is set up (Neon Database recommended)
- [ ] Domain onenowtwo.com.au is registered and accessible
- [ ] Environment variables are documented
- [ ] Build process tested locally (`npm run build`)

## Recommended Hosting Platforms

### Option 1: Render.com (Easiest, Recommended)

**Pros**: Free tier, automatic deployments, built-in SSL, easy setup
**Cost**: Free tier available, paid plans start at $7/month

#### Setup Steps:

1. **Create Render Account**
   - Sign up at [render.com](https://render.com)
   - Connect your Git repository

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Select your repository
   - Configure settings:
     - **Name**: onenowtwo
     - **Region**: Singapore (closest to Australia)
     - **Branch**: main
     - **Runtime**: Node
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm run start`

3. **Set Environment Variables**
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=<your-neon-database-url>
   SESSION_SECRET=<generate-random-string>
   ```

4. **Add Custom Domain**
   - Go to Settings → Custom Domain
   - Add `onenowtwo.com.au` and `www.onenowtwo.com.au`
   - Update DNS records (see DNS Configuration below)

5. **Deploy**
   - Render will automatically deploy on git push

**Using the included render.yaml:**
- Render can auto-detect the `render.yaml` file in your repo
- This pre-configures all settings
- You just need to add your DATABASE_URL in the Render dashboard

---

### Option 2: Railway.app (Developer-Friendly)

**Pros**: Simple, great DX, automatic deployments
**Cost**: Free trial, then $5/month minimum

#### Setup Steps:

1. Sign up at [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway auto-detects Node.js and uses `railway.json` config
5. Add environment variables in dashboard:
   ```
   NODE_ENV=production
   DATABASE_URL=<your-neon-database-url>
   SESSION_SECRET=<generate-random-string>
   ```
6. Go to Settings → Domains → Add `onenowtwo.com.au`
7. Update DNS records (see DNS Configuration below)

---

### Option 3: Fly.io (Global Edge Deployment)

**Pros**: Deploy to Sydney, Australia region, excellent performance
**Cost**: Free tier available, then pay-as-you-go

#### Setup Steps:

1. **Install Fly CLI**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login and Launch**
   ```bash
   fly auth login
   fly launch
   ```

3. **Configure**
   - Fly will detect the `fly.toml` configuration
   - Choose region: `syd` (Sydney, Australia)
   - Set up PostgreSQL database or use external Neon Database

4. **Set Environment Variables**
   ```bash
   fly secrets set NODE_ENV=production
   fly secrets set DATABASE_URL=<your-neon-database-url>
   fly secrets set SESSION_SECRET=<random-string>
   ```

5. **Deploy**
   ```bash
   fly deploy
   ```

6. **Add Custom Domain**
   ```bash
   fly certs add onenowtwo.com.au
   fly certs add www.onenowtwo.com.au
   ```

---

### Option 4: Traditional VPS (DigitalOcean, Linode, Vultr)

**Pros**: Full control, cost-effective for high traffic
**Cost**: $5-10/month
**Complexity**: Requires server administration knowledge

#### Setup Steps:

1. **Create VPS**
   - Ubuntu 22.04 LTS recommended
   - 1GB RAM minimum, 2GB recommended
   - Choose Sydney/Singapore region for Australia

2. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js 20
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install PM2 process manager
   sudo npm install -g pm2
   ```

3. **Clone and Build**
   ```bash
   git clone <your-repo-url> /var/www/onenowtwo
   cd /var/www/onenowtwo
   npm install --production
   npm run build
   ```

4. **Configure Environment**
   ```bash
   nano /var/www/onenowtwo/.env
   ```
   Add:
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=<your-neon-database-url>
   SESSION_SECRET=<random-string>
   ```

5. **Start with PM2**
   ```bash
   pm2 start npm --name "onenowtwo" -- run start
   pm2 save
   pm2 startup
   ```

6. **Install Nginx**
   ```bash
   sudo apt install -y nginx
   ```

7. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/onenowtwo
   ```
   
   Add:
   ```nginx
   server {
       listen 80;
       server_name onenowtwo.com.au www.onenowtwo.com.au;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```
   
   Enable:
   ```bash
   sudo ln -s /etc/nginx/sites-available/onenowtwo /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

8. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d onenowtwo.com.au -d www.onenowtwo.com.au
   ```

9. **Setup Auto-renewal**
   ```bash
   sudo systemctl enable certbot.timer
   ```

---

## DNS Configuration

Update your domain's DNS records at your registrar (e.g., GoDaddy, Namecheap):

### For Render/Railway/Fly (with provided DNS):

**A Record:**
```
Type: A
Name: @
Value: <IP address provided by platform>
TTL: 3600
```

**CNAME Record:**
```
Type: CNAME
Name: www
Value: <domain provided by platform>
TTL: 3600
```

### For VPS:

**A Records:**
```
Type: A
Name: @
Value: <your-vps-ip-address>
TTL: 3600

Type: A
Name: www
Value: <your-vps-ip-address>
TTL: 3600
```

---

## Database Setup (Neon Database)

1. **Create Account**
   - Sign up at [neon.tech](https://neon.tech)
   - Free tier: 10GB storage, 1 project

2. **Create Project**
   - Click "Create a project"
   - Name: onenowtwo
   - Region: AWS Asia Pacific (Sydney) for Australia
   - Compute size: Free tier

3. **Get Connection String**
   - Copy the connection string from dashboard
   - Format: `postgresql://[user]:[password]@[host]/[database]?sslmode=require`

4. **Run Migrations**
   ```bash
   # Locally first
   DATABASE_URL=<your-connection-string> npm run db:push
   ```

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `5000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `SESSION_SECRET` | Session encryption key | Random 32+ char string |

### Generate Secure SESSION_SECRET

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Post-Deployment Verification

1. **Check HTTPS**
   - Visit https://onenowtwo.com.au
   - Verify SSL certificate is valid

2. **Test Pages**
   - [ ] Home page loads with video
   - [ ] All navigation links work
   - [ ] Portfolio page displays correctly
   - [ ] Contact form submits (if implemented)

3. **Performance**
   - Run Lighthouse audit
   - Check mobile responsiveness
   - Verify video loading performance

4. **Monitor**
   - Set up uptime monitoring (e.g., UptimeRobot)
   - Check server logs regularly

---

## Updating the Site

### With Automatic Deployments (Render/Railway/Fly):
```bash
git add .
git commit -m "Update description"
git push origin main
```
Platform will automatically deploy changes.

### With VPS:
```bash
ssh user@your-server
cd /var/www/onenowtwo
git pull origin main
npm install --production
npm run build
pm2 restart onenowtwo
```

---

## Troubleshooting

### Site not loading
- Check DNS propagation: https://dnschecker.org
- Verify environment variables are set
- Check server logs

### Database connection errors
- Verify DATABASE_URL is correct
- Check database is accessible from server IP
- Ensure connection string includes `?sslmode=require`

### Video files not displaying
- Verify videos are in `client/public/media/` directory
- Check video file sizes (consider compression for web)
- Test video URLs directly: `https://onenowtwo.com.au/media/hero/hero-1080.mp4`

### SSL/HTTPS issues
- Wait 24-48 hours for DNS propagation
- Verify DNS records are correct
- Check SSL certificate expiry

---

## Support

For deployment issues:
- Check hosting platform documentation
- Review server/application logs
- Test build locally first: `npm run build && npm run start`

## Cost Estimate

**Minimum (Render Free Tier)**: $0/month
- Render free tier
- Neon Database free tier
- Domain registration only (~$15/year for .com.au)

**Recommended (Production)**: ~$20/month
- Render Starter: $7/month
- Neon Database Pro: $19/month (or stick with free tier)
- Domain: ~$15/year

**High Performance (VPS)**: ~$15-20/month
- VPS: $5-10/month
- Neon Database: Free or $19/month
- Domain: ~$15/year
