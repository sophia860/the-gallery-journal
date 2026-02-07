# Copilot Instructions for The Gallery Journal

## Project Overview
The Gallery is a literary journal and submission platform for contemporary poetry. It combines a static frontend (GitHub Pages) with a headless CMS backend (Strapi Cloud), featuring user authentication, poem submissions, editorial workflows, and optional PayPal integration for voluntary contributions.

**Target Audience**: Poets, writers, and editors in the literary community

**Live Site**: https://sophia860.github.io/the-gallery-journal/

## Tech Stack

### Frontend
- **HTML5**: Semantic structure, single-page application
- **CSS3**: Modern styling with CSS variables, animations, and responsive design
- **Vanilla JavaScript**: No build dependencies, ES6+ features
- **Fonts**: Google Fonts (Inter, Lora, Playfair Display, Rockwell)

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web server framework (v5.2.1)
- **Strapi Cloud**: Headless CMS (backend URL configured in application)
- **JWT Authentication**: Token-based authentication system
- **REST API**: RESTful endpoints for all operations

### Hosting & Deployment
- **GitHub Pages**: Static frontend hosting
- **Strapi Cloud**: Backend and database hosting

### Additional Services
- **PayPal**: Optional payment integration (account configured in PAYPAL_CONFIG.md)
- **Monitoring**: Custom monitoring system with health checks and AI-powered incident analysis

## Coding Guidelines

### General Principles
- Maintain clean, readable code with minimal dependencies
- Prefer vanilla JavaScript over frameworks for frontend
- Follow existing code patterns and conventions
- Keep the single-page application architecture (all HTML/CSS/JS in `index.html`)

### JavaScript
- Use modern ES6+ features (arrow functions, template literals, const/let)
- Use `const` by default; use `let` only when reassignment is needed
- Follow camelCase naming for variables and functions
- Use descriptive, meaningful variable names
- Prefer async/await over promise chains
- Add error handling for all async operations
- Use template literals for string interpolation

### HTML
- Use semantic HTML5 elements
- Maintain accessibility with proper ARIA labels
- Keep structure organized with meaningful class names
- Follow the existing modal/component pattern

### CSS
- Use CSS variables for theming (defined in `:root`)
- Follow the existing naming conventions (kebab-case for classes)
- Maintain responsive design (mobile-first approach)
- Use modern CSS features (Grid, Flexbox, custom properties)
- Keep animations smooth with appropriate timing functions
- Use the existing color palette and typography system

### Node.js/Express
- Use async/await for asynchronous operations
- Implement proper error handling middleware
- Keep routes modular and organized in separate files
- Use environment variables for configuration
- Follow RESTful conventions for API endpoints

## Project Structure

```
the-gallery-journal/
├── .github/
│   ├── agents/                    # Custom agents
│   ├── workflows/                 # GitHub Actions workflows
│   └── copilot-instructions.md    # This file
├── src/
│   ├── server.js                  # Express server with health endpoints
│   ├── strapi-client.js           # Strapi API client
│   ├── routes/
│   │   └── health.js              # Health check endpoints
│   └── monitoring/
│       ├── agent.js               # Monitoring agent
│       └── ai-agent.js            # AI-powered incident analysis
├── index.html                     # Main SPA (HTML/CSS/JS all in one)
├── package.json                   # Dependencies and scripts
├── README.md                      # Project documentation
├── STRAPI_SETUP.md               # Strapi configuration guide
├── PAYPAL_CONFIG.md              # PayPal quick setup
└── PAYPAL_SETUP.md               # Detailed PayPal guide
```

## Architecture & Patterns

### Frontend Architecture
- **Single-Page Application**: All code embedded in `index.html`
- **Modal System**: Dynamic modals for poems, login, registration, and writer's studio
- **State Management**: Simple JavaScript object-based state (`currentUser`, `draftSubmission`)
- **Auto-save**: Debounced auto-save every 2 seconds for drafts
- **Session Persistence**: JWT tokens in localStorage for auto-login

### Backend Integration
- **Strapi Endpoints**:
  - `POST /api/auth/local` - User login
  - `POST /api/auth/local/register` - User registration
  - `GET /api/users/me` - Get current user profile
  - `PUT /api/users/:id` - Update user profile
  - `GET /api/submissions` - List submissions
  - `POST /api/submissions` - Create submission
  - `PUT /api/submissions/:id` - Update submission
  - `DELETE /api/submissions/:id` - Delete submission

### Data Models
- **User**: Extended profile with displayName, bio, profileImage, role (Poet/Editor)
- **Submission**: Title, text, status (draft/submitted/under_review/approved/published), version tracking

### Monitoring System
- Health check endpoints (`/health`, `/ready`, `/metrics`)
- Background monitoring agents with Slack integration
- AI-powered incident analysis using OpenAI/Anthropic APIs
- GitHub Actions workflow for continuous monitoring

## Workflow & Development

### Scripts
- `npm start` - Start Express server on port 3000
- `npm run monitor:agent` - Start monitoring agent
- `npm run monitor:ai` - Start AI incident analysis agent
- `npm test` - Run tests (currently no automated tests)

### Testing
- No automated test suite configured yet
- Manual testing recommended for all changes
- Test both frontend functionality and backend integration
- Verify responsive design on mobile and desktop

### Code Review
- Keep changes minimal and focused
- Maintain existing code style and patterns
- Don't remove working code unless necessary
- Test changes manually before committing
- Update documentation when adding features

### Git Workflow
- All bugfix branches should reference issues
- Use clear, descriptive commit messages
- Test locally before pushing
- Keep commits focused and atomic

### Environment Variables
- `HEALTH_URL` - Health endpoint URL (default: http://localhost:3000/health)
- `READY_URL` - Ready endpoint URL (default: http://localhost:3000/ready)
- `SLACK_WEBHOOK_URL` - Slack webhook for monitoring alerts
- `AI_WEBHOOK_URL` - AI agent webhook
- `OPENAI_API_KEY` - OpenAI API key for AI monitoring
- `ANTHROPIC_API_KEY` - Anthropic API key for AI monitoring

## Design System

### Color Palette
```css
--color-paper: #FAF8F5      /* Background */
--color-ink: #0D0D0D        /* Primary text */
--color-accent: #C41E3A     /* Accent/links */
--color-grey: #6B6B6B       /* Secondary text */
--color-cream: #F5F1EB      /* Light backgrounds */
```

### Typography
- **Serif**: Lora (body text, poems)
- **Display**: Playfair Display (headings)
- **Slab**: Rockwell (special elements)
- **Sans**: Inter (UI elements, buttons)

### Spacing & Layout
- Max content width: 680px
- Grid gutter: 1.618rem (golden ratio)
- Standard padding: 2rem
- Button radius: 12px

## Common Patterns

### Modal Creation
```javascript
// Always check if modal already exists before creating
const existingModal = document.getElementById('modal-id');
if (existingModal) {
    existingModal.remove();
}
// Create modal with proper backdrop and close button
```

### API Calls
```javascript
// Always use try-catch with proper error handling
try {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
} catch (error) {
    console.error('API call failed:', error);
    // Show user-friendly error message
}
```

### Auto-save Pattern
```javascript
// Use debouncing for auto-save
let autoSaveTimeout;
function scheduleAutoSave() {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(saveFunction, 2000);
}
```

## Security Considerations
- Never commit API keys or secrets
- Always validate and sanitize user input
- Use HTTPS for all API calls
- Store JWT tokens securely in localStorage
- Implement proper CORS configuration
- Follow secure authentication practices

## Accessibility
- Use semantic HTML elements
- Provide ARIA labels for interactive elements
- Ensure keyboard navigation works properly
- Maintain sufficient color contrast
- Test with screen readers when making UI changes

## Performance
- Minimize use of external dependencies
- Optimize images and assets
- Use CSS animations instead of JavaScript when possible
- Debounce expensive operations (auto-save, search)
- Keep the single-page architecture lightweight

## Documentation
- Update README.md when adding major features
- Keep setup guides (STRAPI_SETUP.md, PAYPAL_SETUP.md) current
- Document new API endpoints or integrations
- Add code comments for complex logic only
- Follow existing documentation style

## Special Notes
- The main application is intentionally a single-page HTML file for simplicity
- PayPal integration is optional and can be skipped by users
- Mock user system available for development without Strapi
- Monitoring system designed for production backend health checks
- Poetry content remains the property of respective authors
