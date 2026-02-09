// =============================================================================
// The Page Gallery Journal - k6 Load Test Script
// Simulates 100+ concurrent users across all public routes
// =============================================================================
// 
// USAGE:
//   Install k6: brew install k6  (macOS) or https://k6.io/docs/get-started/installation/
//   Run test:   k6 run tests/load/k6-load-test.js
//   Run with output: k6 run --out json=results.json tests/load/k6-load-test.js
//
// =============================================================================

import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// ---------------------------------------------------------------------------
// Custom Metrics
// ---------------------------------------------------------------------------
const errorRate = new Rate('errors');
const pageLoadTrend = new Trend('page_load_time', true);
const successfulRequests = new Counter('successful_requests');
const failedRequests = new Counter('failed_requests');

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
const BASE_URL = __ENV.BASE_URL || 'https://thepagegalleryjournal.com';

// Thresholds - the test FAILS if these are not met
export const options = {
  // Ramp up to 120 virtual users over staged intervals
  stages: [
    { duration: '30s', target: 20 },   // Warm-up: ramp to 20 users
    { duration: '1m',  target: 50 },   // Ramp to 50 users
    { duration: '2m',  target: 120 },  // Peak: hold at 120 concurrent users
    { duration: '1m',  target: 120 },  // Sustained peak load
    { duration: '30s', target: 0 },    // Cool-down: ramp back to 0
  ],

  thresholds: {
    // 95% of requests must complete within 2 seconds
    http_req_duration: ['p(95)<2000', 'p(99)<5000'],
    // Error rate must be below 5%
    errors: ['rate<0.05'],
    // 95% of page loads must complete within 3 seconds
    page_load_time: ['p(95)<3000'],
    // At least 95% of requests must succeed
    http_req_failed: ['rate<0.05'],
  },
};

// ---------------------------------------------------------------------------
// Public Routes (no auth required)
// These are the pages real users will hit most often
// ---------------------------------------------------------------------------
const PUBLIC_ROUTES = [
  { path: '/',                  name: 'Landing Page' },
  { path: '/signin',            name: 'Sign In' },
  { path: '/signup',            name: 'Sign Up' },
  { path: '/collection-gallery', name: 'Collection Gallery' },
  { path: '/community-wall',    name: 'Community Wall' },
  { path: '/afterhours',        name: 'Afterhours' },
  { path: '/rooms',             name: 'Rooms' },
  { path: '/about',             name: 'About' },
  { path: '/gallery-wall',      name: 'Gallery Wall' },
];

// ---------------------------------------------------------------------------
// Authenticated Routes (tested with lighter weight)
// ---------------------------------------------------------------------------
const AUTH_ROUTES = [
  { path: '/studio',            name: 'Studio Hub' },
  { path: '/dashboard',         name: 'Dashboard' },
  { path: '/studio/freewrite',  name: 'Freewrite' },
  { path: '/studio/poetry',     name: 'Poetry Editor' },
  { path: '/studio/work',       name: 'My Work' },
  { path: '/commonplace',       name: 'Commonplace' },
  { path: '/letters',           name: 'Letters' },
  { path: '/editor-dashboard',  name: 'Editor Dashboard' },
  { path: '/collection',        name: 'Collection' },
  { path: '/writers-studio',    name: 'Writers Studio' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getRandomRoute(routes) {
  return routes[Math.floor(Math.random() * routes.length)];
}

function makeRequest(route) {
  const url = `${BASE_URL}${route.path}`;
  const startTime = Date.now();

  const res = http.get(url, {
    headers: {
      'User-Agent': 'k6-load-test/1.0',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
    },
    tags: { page: route.name },
  });

  const loadTime = Date.now() - startTime;
  pageLoadTrend.add(loadTime);

  const success = check(res, {
    [`${route.name} - status is 200`]: (r) => r.status === 200,
    [`${route.name} - response time < 2s`]: (r) => r.timings.duration < 2000,
    [`${route.name} - body is not empty`]: (r) => r.body && r.body.length > 0,
    [`${route.name} - no server errors`]: (r) => r.status < 500,
  });

  if (success) {
    successfulRequests.add(1);
  } else {
    failedRequests.add(1);
  }

  errorRate.add(!success);
  return res;
}

// ---------------------------------------------------------------------------
// Test Scenarios
// ---------------------------------------------------------------------------

// Scenario 1: New visitor browsing public pages
function newVisitorFlow() {
  group('New Visitor Flow', function () {
    // Land on homepage
    makeRequest({ path: '/', name: 'Landing Page' });
    sleep(Math.random() * 3 + 1);

    // Browse the collection gallery
    makeRequest({ path: '/collection-gallery', name: 'Collection Gallery' });
    sleep(Math.random() * 2 + 1);

    // Check out the community wall
    makeRequest({ path: '/community-wall', name: 'Community Wall' });
    sleep(Math.random() * 2 + 1);

    // Visit rooms
    makeRequest({ path: '/rooms', name: 'Rooms' });
    sleep(Math.random() * 2 + 1);

    // Eventually navigate to sign up
    makeRequest({ path: '/signup', name: 'Sign Up' });
    sleep(Math.random() * 1 + 0.5);
  });
}

// Scenario 2: Returning user who signs in and uses studio
function returningUserFlow() {
  group('Returning User Flow', function () {
    // Go to sign in page
    makeRequest({ path: '/signin', name: 'Sign In' });
    sleep(Math.random() * 2 + 1);

    // After "signing in" visit studio
    makeRequest({ path: '/studio', name: 'Studio Hub' });
    sleep(Math.random() * 2 + 1);

    // Use freewrite or poetry editor
    if (Math.random() > 0.5) {
      makeRequest({ path: '/studio/freewrite', name: 'Freewrite' });
    } else {
      makeRequest({ path: '/studio/poetry', name: 'Poetry Editor' });
    }
    sleep(Math.random() * 5 + 2); // Spend time writing

    // Check their work
    makeRequest({ path: '/studio/work', name: 'My Work' });
    sleep(Math.random() * 2 + 1);

    // Visit community wall
    makeRequest({ path: '/community-wall', name: 'Community Wall' });
    sleep(Math.random() * 2 + 1);
  });
}

// Scenario 3: Casual browser hitting random pages
function casualBrowserFlow() {
  group('Casual Browser', function () {
    // Hit 3-5 random public routes
    const numPages = Math.floor(Math.random() * 3) + 3;
    for (let i = 0; i < numPages; i++) {
      const route = getRandomRoute(PUBLIC_ROUTES);
      makeRequest(route);
      sleep(Math.random() * 3 + 1);
    }
  });
}

// Scenario 4: Heavy user exploring everything
function powerUserFlow() {
  group('Power User Flow', function () {
    // Landing
    makeRequest({ path: '/', name: 'Landing Page' });
    sleep(0.5);

    // Sign in
    makeRequest({ path: '/signin', name: 'Sign In' });
    sleep(1);

    // Dashboard
    makeRequest({ path: '/dashboard', name: 'Dashboard' });
    sleep(1);

    // Studio pages
    makeRequest({ path: '/studio', name: 'Studio Hub' });
    sleep(0.5);
    makeRequest({ path: '/studio/freewrite', name: 'Freewrite' });
    sleep(2);
    makeRequest({ path: '/studio/poetry', name: 'Poetry Editor' });
    sleep(2);
    makeRequest({ path: '/studio/work', name: 'My Work' });
    sleep(1);

    // Community features
    makeRequest({ path: '/community-wall', name: 'Community Wall' });
    sleep(1);
    makeRequest({ path: '/collection-gallery', name: 'Collection Gallery' });
    sleep(1);
    makeRequest({ path: '/afterhours', name: 'Afterhours' });
    sleep(1);
    makeRequest({ path: '/rooms', name: 'Rooms' });
    sleep(1);

    // Editor
    makeRequest({ path: '/editor-dashboard', name: 'Editor Dashboard' });
    sleep(1);
  });
}

// ---------------------------------------------------------------------------
// Main Test Function
// Each virtual user randomly picks a scenario to simulate realistic traffic
// ---------------------------------------------------------------------------
export default function () {
  const scenario = Math.random();

  if (scenario < 0.35) {
    // 35% are new visitors
    newVisitorFlow();
  } else if (scenario < 0.60) {
    // 25% are returning users
    returningUserFlow();
  } else if (scenario < 0.85) {
    // 25% are casual browsers
    casualBrowserFlow();
  } else {
    // 15% are power users
    powerUserFlow();
  }

  // Brief pause between iterations
  sleep(Math.random() * 2 + 1);
}

// ---------------------------------------------------------------------------
// Summary handler - formats results for easy reading
// ---------------------------------------------------------------------------
export function handleSummary(data) {
  const summary = {
    timestamp: new Date().toISOString(),
    testDuration: data.state.testRunDurationMs,
    vusMax: data.metrics.vus_max ? data.metrics.vus_max.values.max : 0,
    totalRequests: data.metrics.http_reqs ? data.metrics.http_reqs.values.count : 0,
    failedRequests: data.metrics.http_req_failed ? data.metrics.http_req_failed.values.passes : 0,
    avgResponseTime: data.metrics.http_req_duration ? data.metrics.http_req_duration.values.avg.toFixed(2) : 0,
    p95ResponseTime: data.metrics.http_req_duration ? data.metrics.http_req_duration.values['p(95)'].toFixed(2) : 0,
    p99ResponseTime: data.metrics.http_req_duration ? data.metrics.http_req_duration.values['p(99)'].toFixed(2) : 0,
    errorRate: data.metrics.errors ? (data.metrics.errors.values.rate * 100).toFixed(2) + '%' : '0%',
    thresholdsPassed: !data.root_group || Object.values(data.metrics).every(m => !m.thresholds || Object.values(m.thresholds).every(t => t.ok)),
  };

  const report = `
================================================================================
  THE PAGE GALLERY JOURNAL - LOAD TEST REPORT
  ${summary.timestamp}
================================================================================

  Peak Virtual Users:    ${summary.vusMax}
  Total Requests:        ${summary.totalRequests}
  Failed Requests:       ${summary.failedRequests}
  Error Rate:            ${summary.errorRate}

  Response Times:
    Average:             ${summary.avgResponseTime} ms
    95th Percentile:     ${summary.p95ResponseTime} ms
    99th Percentile:     ${summary.p99ResponseTime} ms

  Thresholds Passed:     ${summary.thresholdsPassed ? 'YES' : 'NO - REVIEW NEEDED'}

================================================================================
`;

  return {
    'stdout': report,
    'tests/load/results/load-test-summary.json': JSON.stringify(summary, null, 2),
  };
}
