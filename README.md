# The Gallery - A Literary Journal for Poetry

**Winter 2026 Edition**

Welcome to The Gallery, a literary magazine showcasing contemporary poetry.

## 🌟 Live Site

Once GitHub Pages is enabled, your site will be available at:
`https://sophia860.github.io/the-gallery-journal/`

## 📖 About

The Gallery is a curated space for poetry that explores:
- Liminal spaces and moments of transformation
- Urban and contemporary life
- Cultural identity and inheritance
- Human connection and isolation
- The natural world and our relationship with it

### Features

✨ **Clean, elegant design** inspired by literary journals  
📱 **Fully responsive** - works beautifully on all devices  
📚 **8 Featured poems** from diverse voices  
🔐 **Login system** for editors and writers (ready for backend integration)  
✍️ **Interactive poem reader** with smooth modal animations

## 🚀 Enable GitHub Pages

To make your site live, follow these steps:

1. Go to your repository on GitHub: [the-gallery-journal](https://github.com/sophia860/the-gallery-journal)
2. Click the **Settings** tab (top right of the repository)
3. In the left sidebar, click **Pages** (under "Code and automation")
4. Under **Build and deployment** → **Source**, select **Deploy from a branch**
5. Under **Branch**, change from "None" to **main**
6. Keep the folder as **/ (root)**
7. Click **Save**

GitHub will take a minute or two to build your site. Once ready, you'll see a green message with your site URL.

## 🎨 Customization

### Add New Poems

Edit `index.html` and add new poem cards to the grid:

```html
<div class="poem-card" data-poem-id="9">
    <div class="poem-title">Your Poem Title</div>
    <div class="poem-author">by Your Name</div>
    <div class="poem-preview">First lines of poem...</div>
    <div class="read-more">Read Full Poem →</div>
</div>
```

Then add the full poem to the JavaScript `poems` object:

```javascript
9: {
    title: "Your Poem Title",
    author: "Your Name",
    text: `Full poem text here...`
}
```

### Change the Issue/Season

Update the issue label in the hero section:

```html
<div class="issue-label">Spring 2026</div>
```

### Modify Colors

Edit the CSS variables at the top of the stylesheet:

```css
:root {
    --color-cream: #f5f1e8;
    --color-dark: #2a2a2a;
    --color-accent: #8b7355;
    --color-light-accent: #c9b8a3;
}
```

## 🔐 Authentication System

The Gallery now features a complete authentication system integrated with Strapi Cloud:

### Strapi Backend
- **Backend URL:** https://supportive-ducks-9506a8aa47.strapiapp.com
- **Authentication:** JWT-based authentication with automatic token management
- **Session Persistence:** Auto-login on page load with valid JWT tokens

### User Features

**Registration:**
- Create new accounts with username, email, and password
- Select role (Poet/Writer or Editor)
- Automatic profile creation with extended fields

**Login:**
- Authenticate with email and password
- Fallback to mock users for development
- Session restored automatically on page reload

**User Profiles:**
- Extended user profiles with:
  - Display name
  - Bio (max 300 characters)
  - Profile image URL
  - Social links (website, location)
- Profile editing from Writer's Studio
- Syncs with Strapi backend when connected

### Submission Management

**For Poets/Writers:**
- Create and save drafts (auto-save every 2 seconds)
- Submit poems for editorial review
- **Optional PayPal integration** for voluntary contributions
- Track submission status (draft, submitted, under_review, approved, published)
- View submission history
- Version tracking for revisions

**For Editors:**
- Review all submissions
- Approve/reject poems
- Add editorial notes and feedback
- Manage publication categories

### PayPal Integration

The Gallery includes optional PayPal integration for writer contributions:
- **Voluntary contributions** when submitting poems
- Multiple payment tiers ($5, $10, $25, $50)
- Skip option for free submissions
- Secure PayPal payment processing
- Payment tracking with submissions

To enable PayPal, see [PAYPAL_SETUP.md](./PAYPAL_SETUP.md) for configuration instructions.

### API Integration

The frontend integrates with the following Strapi endpoints:
- `POST /api/auth/local` - User login
- `POST /api/auth/local/register` - User registration
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/:id` - Update user profile
- `GET /api/submissions` - List submissions (filtered by user role)
- `POST /api/submissions` - Create new submission
- `PUT /api/submissions/:id` - Update submission
- `DELETE /api/submissions/:id` - Delete submission

### Setup Instructions

To configure the Strapi backend, see [STRAPI_SETUP.md](./STRAPI_SETUP.md) for detailed instructions on:
1. Creating the Submission content type
2. Extending the User profile
3. Configuring user roles (Poet and Editor)
4. Setting up permissions
5. Testing the integration

## 📂 Project Structure

```
the-gallery-journal/
├── index.html          # Main homepage with all code
├── src/
│   ├── strapi-client.js    # Strapi API client
│   ├── server.js           # Express server (monitoring)
│   ├── routes/
│   │   └── health.js       # Health check endpoints
│   └── monitoring/
│       ├── agent.js        # Monitoring agent
│       └── ai-agent.js     # AI-powered incident analysis
├── STRAPI_SETUP.md     # Strapi configuration guide
└── README.md           # This file
```

This is a single-page application with embedded CSS and JavaScript, now powered by Strapi Cloud for backend services.

## 🌐 Tech Stack

- **Frontend:**
  - HTML5 - Semantic structure
  - CSS3 - Modern styling with CSS variables and animations
  - Vanilla JavaScript - No build dependencies
- **Backend:**
  - Strapi Cloud - Headless CMS for content management
  - JWT Authentication - Secure token-based auth
  - REST API - RESTful endpoints for all operations
- **Hosting:**
  - GitHub Pages - Free frontend hosting

## 📝 Featured Poets

- Sarah Chen - "Liminal Spaces"
- Marcus Webb - "The Light Collector"
- Priya Sharma - "Inheritance"
- James Liu - "Urban Pastoral"
- Elena Vasquez - "What the Ocean Said"
- David Okonkwo - "Anatomy of Silence"
- Lily Morrison - "The Cartographer's Daughter"
- Rafael Torres - "Midnight Economy"

## 🤝 Contributing

Interested in submitting your work? Writers can now:

1. **Create an Account**
   - Click "Writer Log In" on the homepage
   - Switch to "Register here" link
   - Fill in username, email, password, and select role

2. **Submit Poems**
   - Access your Writer's Studio after logging in
   - Use the typewriter interface or "+ New Poem" button
   - Drafts auto-save every 2 seconds
   - Submit for editorial review when ready

3. **Track Submissions**
   - View all submissions in your Writer's Studio
   - Monitor status: Draft → Submitted → Under Review → Approved → Published
   - Receive editor feedback and notes
   - View version history

4. **Manage Profile**
   - Update display name and bio
   - Add profile image and social links
   - Changes sync with Strapi backend

## 📄 License

This project is open source. Individual poems remain the property of their respective authors.

## 📧 Contact

For inquiries about submissions or collaborations, contact the editorial team.

---

## Backend Monitoring System

This repository includes a comprehensive backend monitoring system with an AI agent for intelligent incident analysis.

### Components

#### 1. Health Check Endpoints (`src/routes/health.js`)
- `/health` - Liveness check (is the service running?)
- `/ready` - Readiness check (are all dependencies available?)
- `/metrics` - Basic performance metrics

#### 2. Monitoring Agent (`src/monitoring/agent.js`)
A background process that continuously monitors your backend:
- Configurable check intervals (default: 30s for health, 60s for ready)
- Consecutive failure detection (alerts after 3 failures)
- Latency monitoring with thresholds
- Slack integration for notifications

#### 3. AI Agent (`src/monitoring/ai-agent.js`)
Intelligent incident analysis using LLMs:
- Supports OpenAI (GPT-4) and Anthropic (Claude) APIs
- Rule-based fallback when no API key configured
- Pattern recognition for recurring issues
- Actionable recommendations

#### 4. GitHub Actions Workflow (`.github/workflows/monitoring.yml`)
Automated monitoring running every 5 minutes:
- Checks all health endpoints
- Generates status reports
- Sends Slack alerts on failures
- Triggers AI analysis for incidents

### Quick Start

```bash
# Start your backend with health endpoints
npm start

# In another terminal, start the monitoring agent
node src/monitoring/agent.js

# Optionally, start the AI agent for incident analysis
OPENAI_API_KEY=sk-xxx node src/monitoring/ai-agent.js
```

### Configuration

Set these environment variables:

| Variable | Description | Default |
|----------|-------------|--------|
| `HEALTH_URL` | Health endpoint URL | `http://localhost:3000/health` |
| `READY_URL` | Ready endpoint URL | `http://localhost:3000/ready` |
| `SLACK_WEBHOOK_URL` | Slack webhook for alerts | - |
| `AI_WEBHOOK_URL` | AI agent webhook | - |
| `OPENAI_API_KEY` | OpenAI API key | - |
| `ANTHROPIC_API_KEY` | Anthropic API key | - |

### GitHub Actions Secrets

Add these secrets in your repository settings:
- `BACKEND_URL` - Your production backend URL
- `SLACK_WEBHOOK_URL` - Slack incoming webhook URL
- `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` - For AI analysis

*"Where poetry passes through like light through glass"*

© 2026 The Gallery
