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

## 🔐 Login System

The login buttons are functional placeholders. To connect them to a real authentication system:

1. Set up a backend (Node.js, Python, etc.)
2. Create an authentication API
3. Update the `handleLogin()` function in `index.html` to make API calls
4. Implement session management
5. Create editor and writer dashboards

## 📂 Project Structure

```
the-gallery-journal/
├── index.html          # Main homepage with all code
└── README.md          # This file
```

This is a single-page application with embedded CSS and JavaScript for easy deployment.

## 🌐 Tech Stack

- **HTML5** - Semantic structure
- **CSS3** - Modern styling with CSS variables and animations
- **Vanilla JavaScript** - No dependencies, lightweight and fast
- **GitHub Pages** - Free hosting

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

Interested in submitting your work? Once the login system is connected to a backend, writers will be able to:

- Create an account
- Submit poems for review
- Track submission status
- Manage their published work

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
