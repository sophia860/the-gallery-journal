# The Gallery - Deployment Guide

**Quick Start Guide for Production Deployment**

This guide provides step-by-step instructions to deploy The Gallery literary journal to production. Choose the deployment path that fits your needs.

---

## 🚀 Quick Deployment Paths

### Path 1: Frontend Only (Fastest - 15 minutes)
Deploy the static website to GitHub Pages for a read-only literary journal.

**Best for:** 
- Showcasing the journal design
- Publishing poems for readers
- No submission system needed yet

**Result:** Public website at `https://sophia860.github.io/the-gallery-journal/`

### Path 2: Full System (Complete - 4-6 hours)
Deploy frontend, backend API, and Strapi CMS for a fully functional submission platform.

**Best for:**
- Accepting writer submissions
- Editorial review workflow
- User authentication and profiles

**Result:** Complete literary journal with submission management

---

## 📋 Path 1: Frontend Deployment (GitHub Pages)

### Prerequisites
- GitHub account with access to the repository
- Repository pushed to `main` branch

### Step 1: Enable GitHub Pages (2 minutes)

1. Go to repository: https://github.com/sophia860/the-gallery-journal
2. Click **Settings** (top right)
3. Click **Pages** in left sidebar (under "Code and automation")
4. Under **Build and deployment** → **Source**:
   - Select **Deploy from a branch**
5. Under **Branch**:
   - Select **main** from dropdown
   - Keep folder as **/ (root)**
6. Click **Save**

### Step 2: Merge the Workflow Fix (5 minutes)

The GitHub Pages workflow has been fixed to trigger on `main` branch. To deploy:

```bash
# If you're working on this branch, merge it to main
git checkout main
git merge copilot/update-deployment-status
git push origin main
```

### Step 3: Verify Deployment (5 minutes)

1. Go to **Actions** tab in GitHub repository
2. Wait for "Deploy GitHub Pages" workflow to complete (green checkmark)
3. Visit your site: `https://sophia860.github.io/the-gallery-journal/`
4. Test on mobile and desktop browsers
5. Verify all poems load in modal view

### Troubleshooting

**Site shows 404:**
- Wait 2-3 minutes after workflow completes
- Clear browser cache
- Check that workflow ran on `main` branch

**Workflow fails:**
- Check workflow file syntax in `.github/workflows/pages.yml`
- Verify Pages is enabled in repository settings
- Check GitHub Actions permissions

---

## 📋 Path 2: Full System Deployment

This deploys all components for a complete submission platform.

---

## Part A: Backend Deployment (Railway.app - Recommended)

### Why Railway.app?
- ✅ $5/month free credit (sufficient for low traffic)
- ✅ Automatic deployments from GitHub
- ✅ Free PostgreSQL database
- ✅ Easy environment variable management
- ✅ HTTPS included

**Alternative platforms:** Render.com, Fly.io, Heroku

### Step 1: Create Railway Account (5 minutes)

1. Go to https://railway.app/
2. Click **Login with GitHub**
3. Authorize Railway to access your repositories

### Step 2: Create New Project (3 minutes)

1. Click **New Project**
2. Select **Deploy from GitHub repo**
3. Choose `sophia860/the-gallery-journal`
4. Railway will detect Node.js automatically

### Step 3: Configure Environment Variables (5 minutes)

1. In Railway dashboard, click your project
2. Go to **Variables** tab
3. Add these variables:

```env
NODE_ENV=production
PORT=3000
STRAPI_URL=https://supportive-ducks-9506a8aa47.strapiapp.com
```

4. (Optional) Add for monitoring:
```env
SLACK_WEBHOOK_URL=your_webhook_url_here
```

### Step 4: Configure Build Settings (2 minutes)

1. Go to **Settings** tab
2. Set **Start Command:** `npm start`
3. Set **Build Command:** `npm install`
4. Set **Root Directory:** leave empty (uses repo root)

### Step 5: Deploy (5 minutes)

1. Click **Deploy** button
2. Wait for build to complete (watch logs)
3. Railway will assign a public URL (e.g., `https://the-gallery-journal.railway.app`)
4. Copy this URL - you'll need it for monitoring

### Step 6: Verify Backend (5 minutes)

Test your deployed backend:

```bash
# Replace with your Railway URL
curl https://your-app.railway.app/health
curl https://your-app.railway.app/ready
curl https://your-app.railway.app/metrics
```

Expected responses:
- `/health`: `{"status": "ok", ...}`
- `/ready`: `{"status": "ready", ...}`
- `/metrics`: `{"service": "the-gallery-journal", ...}`

---

## Part B: Strapi CMS Configuration

### Step 1: Access Strapi Admin (2 minutes)

1. Go to https://supportive-ducks-9506a8aa47.strapiapp.com/admin
2. Log in with your Strapi Cloud credentials
3. If no account exists, create one using the Strapi Cloud dashboard

### Step 2: Create Submission Content Type (15 minutes)

Follow instructions in `STRAPI_SETUP.md` - here's a quick summary:

1. Click **Content-Type Builder** (left sidebar)
2. Click **Create new collection type**
3. Display name: `Submission`
4. Click **Continue**
5. Add fields:

| Field Name | Type | Required |
|------------|------|----------|
| title | Short text | Yes |
| body | Rich text | Yes |
| status | Enumeration | Yes |
| author | Relation (User) | Yes |
| lastSaved | DateTime | Yes |
| submittedAt | DateTime | No |
| reviewedAt | DateTime | No |
| editorNotes | Long text | No |
| category | Short text | No |

6. For `status` enumeration, add values:
   - draft
   - submitted
   - under_review
   - approved
   - published
   - rejected

7. For `author` relation:
   - Type: Relation
   - Relation type: Many Submissions to One User
   
8. Click **Finish** then **Save**

### Step 3: Extend User Profile (10 minutes)

1. Click **Content-Type Builder**
2. Click **User** (under Users & Permissions)
3. Click **Add another field**
4. Add these fields:

| Field Name | Type |
|------------|------|
| displayName | Short text |
| bio | Long text |
| profileImage | Media (Single) |
| socialLinks | JSON |
| role | Enumeration (values: poet, editor) |

5. Click **Save**

### Step 4: Configure User Roles (15 minutes)

#### Create Poet Role:

1. Go to **Settings** → **Users & Permissions Plugin** → **Roles**
2. Click **Add new role**
3. Name: `Poet`
4. Description: `Writers who can submit poems`
5. Set permissions:

**Submission:**
- find: ✅ (with filter: user is author)
- findOne: ✅ (with filter: user is author)
- create: ✅
- update: ✅ (with filter: user is author)
- delete: ✅ (with filter: user is author)

**User:**
- me: ✅
- update: ✅ (own profile only)

6. Click **Save**

#### Create Editor Role:

1. Click **Add new role**
2. Name: `Editor`
3. Description: `Editors who can review submissions`
4. Set permissions:

**Submission:**
- find: ✅ (all submissions)
- findOne: ✅
- create: ✅
- update: ✅ (all submissions)
- delete: ✅

**User:**
- me: ✅
- find: ✅
- findOne: ✅

5. Click **Save**

### Step 5: Configure CORS (5 minutes)

1. Go to **Settings** → **Global settings** → **CORS**
2. Add your domains:
   - `https://sophia860.github.io`
   - Your Railway backend URL
3. Click **Save**

### Step 6: Test Strapi API (10 minutes)

Test the API endpoints:

```bash
STRAPI_URL="https://supportive-ducks-9506a8aa47.strapiapp.com"

# Test registration
curl -X POST "$STRAPI_URL/api/auth/local/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testpoet",
    "email": "test@example.com",
    "password": "TestPassword123"
  }'

# Save the JWT token from the response, then test submissions
# (Replace YOUR_JWT_TOKEN with the token from registration)
curl -X GET "$STRAPI_URL/api/submissions" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Part C: Configure Monitoring

### Step 1: Set GitHub Secrets (5 minutes)

1. Go to repository: https://github.com/sophia860/the-gallery-journal
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these secrets:

**Required:**
- Name: `BACKEND_URL`
- Value: Your Railway backend URL (e.g., `https://your-app.railway.app`)

**Optional (for alerts):**
- Name: `SLACK_WEBHOOK_URL`
- Value: Your Slack incoming webhook URL

**Optional (for AI analysis):**
- Name: `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`
- Value: Your API key

### Step 2: Test Monitoring Workflow (5 minutes)

1. Go to **Actions** tab
2. Click **Backend Health Monitoring**
3. Click **Run workflow** → **Run workflow**
4. Wait for workflow to complete
5. Check the summary for health status

The workflow will now run automatically every 5 minutes and alert on failures.

---

## Part D: Frontend Integration

### Step 1: Update Frontend Configuration (5 minutes)

The frontend (`index.html`) has the Strapi URL hardcoded. Verify it matches:

```javascript
// Around line 2500 in index.html
const STRAPI_URL = 'https://supportive-ducks-9506a8aa47.strapiapp.com';
```

If you're using a different Strapi instance, update this URL.

### Step 2: Test Full Integration (15 minutes)

1. Open your GitHub Pages site: `https://sophia860.github.io/the-gallery-journal/`
2. Click **Writer Log In**
3. Click **Register here**
4. Fill in registration form (select "Poet/Writer" role)
5. Click **Register**
6. You should see the Writer's Studio
7. Test creating a draft poem
8. Test submitting a poem
9. Log out
10. Create an Editor account (select "Editor" role)
11. Log in as Editor
12. Verify you can see submissions

### Common Integration Issues

**CORS errors in browser console:**
- Check Strapi CORS settings include GitHub Pages domain
- Verify domain matches exactly (including https://)

**401 Unauthorized:**
- Check that JWT token is being saved in localStorage
- Verify user role has correct permissions in Strapi

**Submissions not loading:**
- Check browser console for errors
- Verify Submission content type exists in Strapi
- Check that user has permission to view submissions

---

## 🔒 Security Hardening

Before announcing the site publicly, complete these security steps:

### Step 1: Update Backend CORS (2 minutes)

Edit `src/server.js` to restrict CORS:

```javascript
// Replace this line:
app.use(cors());

// With this:
app.use(cors({
  origin: [
    'https://sophia860.github.io',
    // Add your custom domain if you have one
  ],
  credentials: true
}));
```

Redeploy to Railway.

### Step 2: Add Rate Limiting (5 minutes)

```bash
# In repository root
npm install express-rate-limit
```

Edit `src/server.js`:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### Step 3: Add Security Headers (2 minutes)

```bash
npm install helmet
```

Edit `src/server.js`:

```javascript
const helmet = require('helmet');

app.use(helmet());
```

### Step 4: Environment Variables (5 minutes)

Ensure no secrets are in code:

```bash
# Check for accidentally committed secrets
git log -p | grep -i "password\|secret\|key" | head -20
```

If you find any:
1. Revoke those credentials immediately
2. Remove from git history
3. Use environment variables instead

### Step 5: Run Security Audit (2 minutes)

```bash
npm audit
npm audit fix
```

---

## 📊 Post-Deployment Checklist

After completing deployment, verify everything works:

### Frontend Checks
- [ ] Site loads at GitHub Pages URL
- [ ] All poems display correctly
- [ ] Modal viewer works
- [ ] Mobile responsive design works
- [ ] Login modal appears
- [ ] Registration form works
- [ ] No console errors in browser
- [ ] HTTPS padlock shows in browser

### Backend Checks
- [ ] Health endpoint responds: `/health`
- [ ] Ready endpoint responds: `/ready`
- [ ] Metrics endpoint responds: `/metrics`
- [ ] HTTPS is enabled
- [ ] CORS allows GitHub Pages domain only
- [ ] Rate limiting is active
- [ ] Security headers present

### Strapi Checks
- [ ] Can register new user
- [ ] Can log in
- [ ] JWT token is saved and used
- [ ] Poet can create submission
- [ ] Poet can see own submissions
- [ ] Editor can see all submissions
- [ ] Editor can update submission status
- [ ] Profile updates sync correctly

### Monitoring Checks
- [ ] GitHub Actions workflow runs every 5 minutes
- [ ] Workflow succeeds with production backend URL
- [ ] Alerts work (test by shutting down backend briefly)
- [ ] AI analysis triggers on failures (if configured)

---

## 🚨 Troubleshooting Guide

### GitHub Pages Not Deploying

**Symptom:** Workflow succeeds but site not updating

**Solutions:**
1. Wait 2-3 minutes after workflow completes
2. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
3. Check that workflow ran on `main` branch
4. Verify GitHub Pages is enabled in Settings

### Backend Won't Start on Railway

**Symptom:** Deployment fails with error

**Common causes:**
1. **Dependencies not installed:** Add `npm install` as build command
2. **Wrong start command:** Should be `npm start`
3. **Port binding:** Use `process.env.PORT || 3000`
4. **Missing package.json:** Ensure it's in repository root

**Debug steps:**
1. Check Railway logs for error messages
2. Verify package.json exists and has correct scripts
3. Test locally: `npm install && npm start`

### Strapi API Returns 403 Forbidden

**Symptom:** API calls fail with 403 status

**Solutions:**
1. Check user role has required permissions
2. Verify JWT token is valid (check expiration)
3. Check that content type permissions are set correctly
4. Ensure user is authenticated (token in Authorization header)

### CORS Errors in Browser

**Symptom:** "CORS policy blocked" in console

**Solutions:**
1. Add GitHub Pages URL to Strapi CORS settings
2. Include protocol (https://) and exact domain
3. Don't include trailing slash
4. Restart Strapi after CORS changes
5. Clear browser cache

### Monitoring Alerts Spam

**Symptom:** Getting alerts every 5 minutes

**Solutions:**
1. Check backend is running and accessible
2. Verify `BACKEND_URL` secret is correct
3. Test health endpoints manually with curl
4. Check Railway logs for errors
5. Adjust alert threshold in workflow if needed

---

## 💰 Cost Tracking

### Free Tier Limits

**Railway.app:**
- $5 free credit per month
- ~500 hours of execution time
- Should be enough for low-traffic site
- Monitor usage in Railway dashboard

**Strapi Cloud (Free):**
- 1 project
- 2 content types
- 1,000 entries
- Upgrade to Pro ($29/month) if you need more

**GitHub:**
- Pages: Unlimited (free)
- Actions: 2,000 minutes/month (free tier)
- Monitoring workflow uses ~150 minutes/month

### When to Upgrade

Consider paid plans when:
- Railway: Exceeding $5/month in usage
- Strapi: Need more than 2 content types or 1,000 entries
- Traffic: Getting consistent 1000+ visitors/day

---

## 🎯 Success Metrics

Track these metrics post-launch:

### Technical Metrics
- **Uptime:** Target 99.9%
- **Response time:** < 2 seconds for all pages
- **Error rate:** < 0.1%
- **API latency:** < 500ms average

### Business Metrics
- **Daily visitors:** Track in GitHub Pages/Railway analytics
- **Submissions:** Track in Strapi admin panel
- **User registrations:** Track growth over time
- **Conversion rate:** Visitors → registered users

### Monitoring Tools
- Railway: Built-in metrics dashboard
- GitHub: Pages insights
- Strapi: Admin dashboard analytics
- Custom: GitHub Actions monitoring reports

---

## 🆘 Getting Help

### Resources
- **GitHub Pages:** https://docs.github.com/en/pages
- **Railway:** https://docs.railway.app/
- **Strapi:** https://docs.strapi.io/
- **Express.js:** https://expressjs.com/

### Support Channels
- GitHub Issues: For code-related questions
- Railway Discord: For deployment issues
- Strapi Discord: For CMS questions
- Stack Overflow: For general technical questions

---

## 📝 Maintenance Tasks

### Daily
- [ ] Check monitoring alerts
- [ ] Review any failed workflow runs
- [ ] Monitor Railway usage/costs

### Weekly
- [ ] Review Strapi submissions
- [ ] Check for dependency updates: `npm outdated`
- [ ] Review security advisories: `npm audit`

### Monthly
- [ ] Update dependencies: `npm update`
- [ ] Review Railway/Strapi costs
- [ ] Backup Strapi content
- [ ] Performance review (response times, uptime)

### Quarterly
- [ ] Security audit
- [ ] Content review
- [ ] UX improvements based on user feedback
- [ ] Consider scaling if traffic grows

---

**Remember:** Start with Path 1 (Frontend Only) to get something live quickly, then add backend features incrementally. This reduces risk and allows you to test each component independently.

Good luck with your deployment! 🚀
