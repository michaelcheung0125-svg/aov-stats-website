# Deployment Guide

## Overview

This guide covers deploying your AOV Stats website to production. We'll use free tiers where possible.

## Architecture

- **Frontend**: Vercel (free)
- **Backend**: Render (free)
- **Database**: MongoDB Atlas (free)

---

## Part 1: MongoDB Atlas Setup (Database)

### 1. Create Production Cluster

Follow the steps in `MONGODB_SETUP.md` to create a MongoDB Atlas cluster.

### 2. Security Best Practices

1. **Strong Password**: Use a password generator
2. **IP Whitelist**: Add your server's IP (we'll get this from Render later)
3. **Separate User**: Create a production-specific database user

### 3. Get Connection String

Save your production connection string:
```
mongodb+srv://produser:PASSWORD@cluster0.xxxxx.mongodb.net/aov_stats_prod?retryWrites=true&w=majority
```

---

## Part 2: Backend Deployment (Render)

### 1. Prepare Backend for Deployment

Update `server/package.json` to ensure start script exists:
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```

### 2. Create Render Account

1. Go to https://render.com
2. Sign up with GitHub (recommended)
3. Authorize Render to access your repositories

### 3. Push Code to GitHub

```bash
cd aov-stats-website
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/aov-stats-website.git
git push -u origin main
```

### 4. Create Web Service on Render

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `aov-stats-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### 5. Add Environment Variables

In Render dashboard, add:
```
PORT=5000
MONGODB_URI=mongodb+srv://produser:PASSWORD@cluster0.xxxxx.mongodb.net/aov_stats_prod
NODE_ENV=production
```

### 6. Deploy

1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Note your backend URL: `https://aov-stats-backend.onrender.com`

### 7. Update MongoDB IP Whitelist

1. Go to MongoDB Atlas → Network Access
2. Add Render's IP ranges or use "Allow Access from Anywhere" (less secure)

### 8. Seed Production Database

Use Render's Shell feature:
1. Go to your service → Shell tab
2. Run:
```bash
node src/scrapers/runHeroScraper.js
node src/scrapers/runPlayerScraper.js
```

Or run locally with production connection string:
```bash
MONGODB_URI="your-production-uri" node src/scrapers/runHeroScraper.js
```

---

## Part 3: Frontend Deployment (Vercel)

### 1. Prepare Frontend for Deployment

Update `client/.env.production`:
```env
VITE_API_URL=https://aov-stats-backend.onrender.com/api
```

### 2. Create Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel

### 3. Deploy Frontend

**Option A: Vercel CLI**
```bash
cd client
npm install -g vercel
vercel login
vercel
```

**Option B: Vercel Dashboard**
1. Click "Add New Project"
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 4. Add Environment Variables

In Vercel dashboard → Settings → Environment Variables:
```
VITE_API_URL=https://aov-stats-backend.onrender.com/api
```

### 5. Deploy

1. Click "Deploy"
2. Wait for deployment (2-3 minutes)
3. Your site will be live at: `https://aov-stats-website.vercel.app`

### 6. Custom Domain (Optional)

1. Go to Vercel → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

---

## Part 4: Post-Deployment Configuration

### 1. Update CORS Settings

Update `server/src/server.js`:
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://aov-stats-website.vercel.app',
    'https://your-custom-domain.com'
  ],
  credentials: true
}));
```

Redeploy backend after this change.

### 2. Test Production Site

Visit your Vercel URL and test:
- ✅ Home page loads
- ✅ Search functionality works
- ✅ Heroes page displays data
- ✅ Player profiles load
- ✅ Rankings page works

### 3. Monitor Performance

**Render Dashboard**:
- Check logs for errors
- Monitor response times
- View resource usage

**Vercel Dashboard**:
- Check deployment logs
- Monitor bandwidth usage
- View analytics

---

## Alternative Deployment Options

### Backend Alternatives

**Railway** (https://railway.app):
- Similar to Render
- $5/month free credit
- Easier MongoDB integration

**Heroku** (https://heroku.com):
- Free tier discontinued
- $7/month minimum
- More mature platform

**Fly.io** (https://fly.io):
- Free tier available
- Global edge deployment
- More complex setup

### Frontend Alternatives

**Netlify** (https://netlify.com):
- Similar to Vercel
- Free tier generous
- Great for static sites

**GitHub Pages**:
- Free for public repos
- Static hosting only
- Requires custom build setup

**Cloudflare Pages**:
- Free unlimited bandwidth
- Fast global CDN
- Good for static sites

---

## Environment Variables Summary

### Development (.env files)

**Backend** (`server/.env`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/aov_stats
NODE_ENV=development
```

**Frontend** (`client/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

### Production (Platform Settings)

**Backend** (Render):
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/aov_stats_prod
NODE_ENV=production
```

**Frontend** (Vercel):
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## Continuous Deployment

### Automatic Deployments

Both Vercel and Render support automatic deployments:

1. **Push to GitHub**: `git push origin main`
2. **Automatic Build**: Platforms detect changes
3. **Automatic Deploy**: New version goes live

### Branch Deployments

**Vercel**:
- Every branch gets a preview URL
- Perfect for testing features

**Render**:
- Create separate services for staging
- Use different branches

---

## Cost Breakdown

### Free Tier Limits

**MongoDB Atlas**:
- 512 MB storage
- Shared RAM
- Good for ~10,000 users

**Render**:
- 750 hours/month
- Sleeps after 15 min inactivity
- 100 GB bandwidth

**Vercel**:
- 100 GB bandwidth
- Unlimited deployments
- 100 builds/day

### When to Upgrade

Upgrade when you hit:
- 10,000+ monthly active users
- Need 24/7 uptime (no sleep)
- Need faster response times
- Need more storage

**Estimated Costs**:
- MongoDB Atlas: $9/month (M2 tier)
- Render: $7/month (Starter)
- Vercel: $20/month (Pro)
- **Total**: ~$36/month for production-ready setup

---

## Monitoring & Maintenance

### Health Checks

Add a health check endpoint (already included):
```javascript
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});
```

### Logging

**Backend Logs** (Render):
- View in Render dashboard
- Download for analysis
- Set up log alerts

**Frontend Errors** (Vercel):
- Use Vercel Analytics
- Integrate Sentry for error tracking

### Database Backups

**MongoDB Atlas**:
- Automatic backups on paid tiers
- Manual exports on free tier
- Use MongoDB Compass to export

### Scheduled Tasks

For the cron job (daily stats update):
- Render free tier may sleep
- Consider using external cron service:
  - https://cron-job.org (free)
  - https://easycron.com (free tier)
  - Call your API endpoint daily

---

## Security Checklist

- ✅ Use environment variables for secrets
- ✅ Enable HTTPS (automatic on Vercel/Render)
- ✅ Restrict MongoDB IP access
- ✅ Use strong database passwords
- ✅ Keep dependencies updated
- ✅ Enable rate limiting (add express-rate-limit)
- ✅ Validate user input
- ✅ Set secure CORS policies

---

## Troubleshooting Deployment

### Backend Won't Start

**Check**:
- Environment variables are set correctly
- MongoDB connection string is valid
- Build logs for errors
- Node version compatibility

### Frontend Can't Connect to Backend

**Check**:
- VITE_API_URL is correct
- CORS is configured properly
- Backend is running (not sleeping)
- Network tab in browser DevTools

### Database Connection Fails

**Check**:
- MongoDB Atlas IP whitelist
- Connection string format
- Username/password correct
- Database user has correct permissions

### Render Service Sleeping

**Solutions**:
- Upgrade to paid tier ($7/month)
- Use external service to ping every 10 minutes
- Accept 15-second cold start on first request

---

## Performance Optimization

### Backend

1. **Enable Compression**:
```javascript
const compression = require('compression');
app.use(compression());
```

2. **Add Caching**:
```javascript
const cache = require('memory-cache');
// Cache hero stats for 1 hour
```

3. **Database Indexing**:
Already included in models

### Frontend

1. **Code Splitting**:
```javascript
const HeroDetail = lazy(() => import('./pages/HeroDetail'));
```

2. **Image Optimization**:
- Use WebP format
- Lazy load images
- Use CDN for assets

3. **Bundle Size**:
```bash
npm run build
# Check dist/ folder size
```

---

## Next Steps After Deployment

1. **Add Analytics**: Google Analytics or Plausible
2. **SEO Optimization**: Add meta tags, sitemap
3. **PWA Support**: Add service worker
4. **Error Tracking**: Integrate Sentry
5. **Performance Monitoring**: Use Lighthouse
6. **User Feedback**: Add feedback form
7. **Social Sharing**: Add Open Graph tags

---

## Support & Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Community**: Stack Overflow, Reddit r/webdev

Good luck with your deployment! 🚀
