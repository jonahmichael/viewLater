# Backend Deployment Guide

This guide will help you deploy your ViewLater backend to various hosting platforms.

## Table of Contents
1. [Preparing for Deployment](#preparing-for-deployment)
2. [Hosting Options](#hosting-options)
3. [Deploy to Render (Recommended - Free)](#deploy-to-render)
4. [Deploy to Railway](#deploy-to-railway)
5. [Deploy to Heroku](#deploy-to-heroku)
6. [Deploy to DigitalOcean](#deploy-to-digitalocean)
7. [Database Hosting](#database-hosting)
8. [Connect Frontend to Backend](#connect-frontend-to-backend)

---

## Preparing for Deployment

### Step 1: Add Production Scripts

Update your `package.json`:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "init-db": "node config/initDatabase.js"
  },
  "engines": {
    "node": ">=14.0.0",
    "npm": ">=6.0.0"
  }
}
```

### Step 2: Create `.gitignore`

Ensure you have a `.gitignore` file:

```
node_modules/
.env
.DS_Store
npm-debug.log
*.log
```

### Step 3: Environment Variables

Your backend needs these environment variables:

```env
NODE_ENV=production
PORT=5000
DB_HOST=your-database-host
DB_PORT=5432
DB_NAME=viewlater
DB_USER=your-db-user
DB_PASSWORD=your-db-password
```

---

## Hosting Options

| Platform | Free Tier | Database Included | Difficulty |
|----------|-----------|-------------------|------------|
| **Render** | ✅ Yes | ✅ Yes (PostgreSQL) | Easy |
| **Railway** | ✅ Yes ($5 credit) | ✅ Yes | Easy |
| **Heroku** | ❌ No (paid) | ✅ Add-on available | Medium |
| **DigitalOcean** | ❌ No ($4/month) | ✅ Managed DB | Medium |
| **AWS** | ✅ Free tier | ✅ RDS available | Hard |
| **Vercel** | ✅ Yes | ❌ No | Easy |

---

## Deploy to Render (Recommended)

Render offers free hosting for Node.js apps with PostgreSQL database.

### Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub, GitLab, or Google

### Step 2: Create PostgreSQL Database

1. Click **New +** → **PostgreSQL**
2. Fill in details:
   - **Name**: `viewlater-db`
   - **Database**: `viewlater`
   - **User**: `viewlater_user`
   - **Region**: Choose closest to you
3. Select **Free** plan
4. Click **Create Database**
5. **Save the credentials** (Internal/External Database URLs)

### Step 3: Push Code to GitHub

```bash
cd "ViewLater"
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/viewlater.git
git push -u origin main
```

### Step 4: Create Web Service

1. Click **New +** → **Web Service**
2. Connect your GitHub repository
3. Fill in details:
   - **Name**: `viewlater-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

### Step 5: Add Environment Variables

In Render dashboard, go to **Environment** tab and add:

```
NODE_ENV=production
PORT=10000
DB_HOST=dpg-xxxxx.render.com
DB_PORT=5432
DB_NAME=viewlater
DB_USER=viewlater_user
DB_PASSWORD=your-password-from-step-2
```

### Step 6: Deploy

1. Click **Create Web Service**
2. Wait for deployment (3-5 minutes)
3. Your backend will be at: `https://viewlater-backend.onrender.com`

### Step 7: Initialize Database

After first deployment, run the init script:

```bash
# Using Render Shell (in dashboard)
npm run init-db
```

✅ **Done!** Your backend is live.

---

## Deploy to Railway

Railway offers $5 free credit monthly.

### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub

### Step 2: Create New Project

1. Click **New Project**
2. Select **Deploy from GitHub repo**
3. Choose your ViewLater repository

### Step 3: Add PostgreSQL Database

1. Click **New** → **Database** → **Add PostgreSQL**
2. Railway auto-generates connection string
3. Copy the **DATABASE_URL**

### Step 4: Configure Environment Variables

In your service settings, add:

```
NODE_ENV=production
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

Railway will automatically inject the database URL.

### Step 5: Update Database Config

Update `config/database.js` to support `DATABASE_URL`:

```javascript
const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.DATABASE_URL) {
  // Production (Railway, Heroku)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  });
} else {
  // Development
  sequelize = new Sequelize(
    process.env.DB_NAME || 'viewlater',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'password',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: false
    }
  );
}

// Test connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
  }
};

module.exports = { sequelize, testConnection };
```

### Step 6: Deploy

Railway auto-deploys on git push. Your backend will be at:
`https://viewlater-backend.up.railway.app`

✅ **Done!**

---

## Deploy to Heroku

Heroku no longer offers free tier but is still popular.

### Step 1: Install Heroku CLI

```bash
# Windows (using npm)
npm install -g heroku

# Or download installer
# https://devcenter.heroku.com/articles/heroku-cli
```

### Step 2: Login to Heroku

```bash
heroku login
```

### Step 3: Create Heroku App

```bash
cd "ViewLater"
heroku create viewlater-backend
```

### Step 4: Add PostgreSQL

```bash
heroku addons:create heroku-postgresql:mini
```

### Step 5: Set Environment Variables

```bash
heroku config:set NODE_ENV=production
```

### Step 6: Deploy

```bash
git push heroku main
```

### Step 7: Initialize Database

```bash
heroku run npm run init-db
```

Your backend: `https://viewlater-backend.herokuapp.com`

---

## Deploy to DigitalOcean

More control but requires payment ($4-6/month).

### Step 1: Create Droplet

1. Go to [DigitalOcean](https://www.digitalocean.com)
2. Create → Droplets
3. Choose **Ubuntu 22.04 LTS**
4. Plan: **Basic $4/month**
5. Add SSH key
6. Create Droplet

### Step 2: SSH into Server

```bash
ssh root@your-droplet-ip
```

### Step 3: Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 4: Install PostgreSQL

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Step 5: Create Database

```bash
sudo -u postgres psql
CREATE DATABASE viewlater;
CREATE USER viewlater_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE viewlater TO viewlater_user;
\q
```

### Step 6: Clone Your Repository

```bash
cd /var/www
git clone https://github.com/yourusername/viewlater.git
cd viewlater
npm install
```

### Step 7: Create .env File

```bash
nano .env
```

Add your environment variables.

### Step 8: Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
pm2 start server.js --name viewlater-backend
pm2 startup
pm2 save
```

### Step 9: Setup Nginx (Reverse Proxy)

```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/viewlater
```

Add configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/viewlater /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

Your backend: `http://your-domain.com`

---

## Database Hosting

If you want to host database separately:

### Option 1: Render PostgreSQL (Free)
- Free 90 days, then expires
- Good for development

### Option 2: Railway PostgreSQL
- $5/month credit (usage-based)
- Good for small projects

### Option 3: Supabase (Free)
1. Go to [supabase.com](https://supabase.com)
2. Create project
3. Copy connection string
4. Use in your backend

### Option 4: ElephantSQL (Free)
1. Go to [elephantsql.com](https://www.elephantsql.com)
2. Create free plan (20MB)
3. Copy connection URL
4. Use in your backend

### Option 5: Neon (Free)
1. Go to [neon.tech](https://neon.tech)
2. Create project
3. Get connection string
4. Generous free tier

---

## Connect Frontend to Backend

### Step 1: Update API URL

Edit `client/src/api/api.js`:

```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

### Step 2: Add Environment Variable

Create `client/.env`:

```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

### Step 3: Update CORS in Backend

Edit `server.js`:

```javascript
const cors = require('cors');

// Allow your frontend domain
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://your-frontend-domain.com'
  ],
  credentials: true
}));
```

### Step 4: Deploy Frontend

You can deploy frontend to:
- **Vercel** (recommended for React)
- **Netlify**
- **GitHub Pages**
- **Render Static Site**

#### Deploy to Vercel:

```bash
cd client
npm install -g vercel
vercel
```

Follow prompts, and your frontend will be live!

---

## Production Checklist

Before going live:

### Security
- [ ] Use strong database passwords
- [ ] Enable SSL/HTTPS
- [ ] Set NODE_ENV=production
- [ ] Remove console.logs
- [ ] Add rate limiting
- [ ] Validate all inputs
- [ ] Use helmet.js for security headers

### Performance
- [ ] Enable gzip compression
- [ ] Set up database indexes (already done)
- [ ] Use connection pooling (already configured)
- [ ] Enable caching headers

### Monitoring
- [ ] Set up error logging (Sentry)
- [ ] Monitor database performance
- [ ] Set up uptime monitoring (UptimeRobot)

### Backup
- [ ] Enable database backups
- [ ] Test restore process
- [ ] Document recovery procedures

---

## Quick Start Scripts

### Deploy to Render (Automated)

Create `deploy.sh`:

```bash
#!/bin/bash
git add .
git commit -m "Deploy to production"
git push origin main
echo "✅ Pushed to GitHub. Render will auto-deploy!"
```

### Update Environment Variables

```bash
# Render
# Go to dashboard → Environment tab → Add/Edit

# Railway
railway variables set KEY=value

# Heroku
heroku config:set KEY=value
```

---

## Troubleshooting

### "Cannot connect to database"
- Check DATABASE_URL or individual DB_ variables
- Verify database is running
- Check firewall rules
- Ensure SSL is configured if required

### "Port already in use"
- Change PORT in environment variables
- Kill existing process: `pm2 stop all`

### "Module not found"
- Run `npm install` in production
- Check package.json dependencies
- Ensure all packages are in dependencies (not devDependencies)

### "CORS error"
- Add frontend URL to CORS whitelist
- Check API_URL in frontend matches backend URL
- Verify backend is running

---

## Cost Estimates

| Platform | Free Option | Paid Option | Best For |
|----------|-------------|-------------|----------|
| **Render** | ✅ Yes | $7/month | Small projects |
| **Railway** | $5 credit | $5-20/month | Hobby projects |
| **Heroku** | ❌ No | $7-25/month | Enterprise |
| **DigitalOcean** | ❌ No | $4-12/month | Full control |
| **AWS** | Free tier | Variable | Scalability |

---

## Recommended Setup

**For Development:**
- Backend: localhost
- Database: Local PostgreSQL

**For Production (Free):**
- Backend: Render Web Service (Free)
- Database: Render PostgreSQL (Free 90 days) or Neon (Free)
- Frontend: Vercel (Free)

**For Production (Paid):**
- Backend: Railway ($5-10/month)
- Database: Railway PostgreSQL (included)
- Frontend: Vercel (Free or Pro)

---

## Next Steps

1. ✅ Choose a hosting platform
2. ✅ Set up database
3. ✅ Deploy backend
4. ✅ Update frontend API URL
5. ✅ Deploy frontend
6. ✅ Test everything works
7. ✅ Set up monitoring
8. ✅ Configure backups

Your backend is ready to deploy! 🚀
