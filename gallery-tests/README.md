# The Gallery Journal - Complete Automated Testing Suite

A comprehensive end-to-end testing suite for The Gallery Journal application, including 100-user signup stress tests, work submission flows, gallery CRUD operations, admin dashboard testing, accessibility compliance, and performance benchmarking.

## Project Structure

```
gallery-tests/
|-- package.json
|-- playwright.config.ts
|-- k6-load-test.js
|-- README.md
|-- test-data/
|   |-- generate-users.js
|-- tests/
    |-- signup-100-users.spec.ts
    |-- signin-and-submit.spec.ts
    |-- full-flow-e2e.spec.ts
    |-- gallery-crud.spec.ts
    |-- admin-dashboard.spec.ts
    |-- accessibility.spec.ts
    |-- performance.spec.ts
```

## Test Suites Overview

### 1. Signup 100 Users Stress Test (`signup-100-users.spec.ts`)
- Registers 100 unique users concurrently in batches of 10
- Validates email uniqueness and password strength
- Measures signup throughput and error rates
- Tests duplicate email handling

### 2. Sign In & Submit (`signin-and-submit.spec.ts`)
- Tests authentication flow for registered users
- Validates work submission pipeline
- Tests form validation and file uploads
- Verifies post-submission state

### 3. Full Flow E2E (`full-flow-e2e.spec.ts`)
- Complete user journey from public pages to authenticated areas
- Landing page rendering and navigation
- Responsive design checks (mobile, tablet, desktop)
- Protected route access control

### 4. Gallery CRUD (`gallery-crud.spec.ts`)
- Create, Read, Update, Delete operations for gallery items
- Image upload and preview
- Search, filter, and pagination
- Bulk operations and ownership validation

### 5. Admin Dashboard (`admin-dashboard.spec.ts`)
- Admin-only access control
- User management (list, search, suspend, activate)
- Content moderation (approve, reject, flag)
- Analytics and reporting
- System settings management

### 6. Accessibility (`accessibility.spec.ts`)
- WCAG 2.1 AA compliance via axe-core
- Keyboard navigation and focus management
- Screen reader support (headings, ARIA labels, landmarks)
- Color contrast validation
- Responsive zoom and text resizing

### 7. Performance (`performance.spec.ts`)
- Core Web Vitals (FCP, LCP, CLS)
- Page load budgets for critical pages
- Resource optimization (bundle sizes, image lazy loading)
- API response time thresholds
- Caching validation
- Memory leak detection

## Prerequisites

- Node.js >= 18
- npm >= 9
- k6 (for load testing): `brew install k6` or [install k6](https://k6.io/docs/getting-started/installation/)

## Setup

```bash
# Navigate to test directory
cd gallery-tests

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps
```

## Environment Variables

Create a `.env` file or set the following environment variables:

```bash
# Application URL
BASE_URL=http://localhost:3000

# Test user credentials
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=TestPass123!

# Admin credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=AdminPass123!
```

## Running Tests

### Run All Tests
```bash
npx playwright test
```

### Run Specific Test Suite
```bash
# Signup stress test
npx playwright test signup-100-users

# Sign in and submit
npx playwright test signin-and-submit

# Full E2E flow
npx playwright test full-flow-e2e

# Gallery CRUD
npx playwright test gallery-crud

# Admin dashboard
npx playwright test admin-dashboard

# Accessibility
npx playwright test accessibility

# Performance
npx playwright test performance
```

### Run with UI Mode
```bash
npx playwright test --ui
```

### Run in Headed Mode
```bash
npx playwright test --headed
```

### Run k6 Load Test
```bash
k6 run k6-load-test.js
```

### Generate Test Data
```bash
node test-data/generate-users.js
```

## Viewing Reports

```bash
# Open HTML report
npx playwright show-report
```

Reports are generated in `playwright-report/` directory after each test run.

## CI/CD Integration

This test suite is designed to run in CI pipelines. Example GitHub Actions workflow:

```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - name: Install dependencies
        run: |
          cd gallery-tests
          npm ci
          npx playwright install --with-deps
      - name: Run tests
        run: |
          cd gallery-tests
          npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: gallery-tests/playwright-report/
```

## Configuration

Test configuration is in `playwright.config.ts`. Key settings:

- **Timeout**: 60s per test (120s for stress tests)
- **Retries**: 2 on CI, 0 locally
- **Workers**: 4 parallel workers
- **Browsers**: Chromium, Firefox, WebKit
- **Base URL**: Configurable via `BASE_URL` env var

## Troubleshooting

- **Tests timing out**: Increase timeout in `playwright.config.ts`
- **Browser not found**: Run `npx playwright install --with-deps`
- **Port conflicts**: Ensure the application is running on the configured `BASE_URL`
- **Flaky tests**: Check network conditions, increase `waitForTimeout` values
