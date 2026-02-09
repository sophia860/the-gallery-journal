import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Counter, Trend } from 'k6/metrics';

/**
 * k6 Load Test for The Gallery Journal
 * Simulates concurrent user traffic across critical endpoints
 *
 * Usage: k6 run k6-load-test.js
 * With options: k6 run --vus 50 --duration 5m k6-load-test.js
 */

// Custom metrics
const errorRate = new Rate('errors');
const signupSuccess = new Counter('signup_success');
const loginSuccess = new Counter('login_success');
const galleryLoadTime = new Trend('gallery_load_time');
const signupTime = new Trend('signup_time');
const loginTime = new Trend('login_time');

// Configuration
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
  stages: [
    { duration: '1m', target: 20 },   // Ramp up to 20 users
    { duration: '3m', target: 50 },   // Ramp up to 50 users
    { duration: '5m', target: 100 },  // Ramp up to 100 users
    { duration: '3m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 50 },   // Ramp down to 50
    { duration: '1m', target: 0 },    // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'],   // 95% of requests < 3s
    http_req_failed: ['rate<0.05'],       // Error rate < 5%
    errors: ['rate<0.1'],                 // Custom error rate < 10%
    signup_time: ['p(95)<5000'],          // 95% of signups < 5s
    login_time: ['p(95)<3000'],           // 95% of logins < 3s
    gallery_load_time: ['p(95)<4000'],    // 95% of gallery loads < 4s
  },
};

function generateUniqueEmail() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `loadtest_${timestamp}_${random}@test.com`;
}

function generatePassword() {
  return `LoadTest${Math.random().toString(36).substring(2, 10)}!1`;
}

export default function () {
  const email = generateUniqueEmail();
  const password = generatePassword();

  group('Public Pages', () => {
    // Landing page
    const landingRes = http.get(`${BASE_URL}/`);
    check(landingRes, {
      'landing page status 200': (r) => r.status === 200,
      'landing page has content': (r) => r.body && r.body.length > 0,
    }) || errorRate.add(1);

    sleep(1);

    // Gallery page
    const galleryStart = Date.now();
    const galleryRes = http.get(`${BASE_URL}/gallery`);
    galleryLoadTime.add(Date.now() - galleryStart);
    check(galleryRes, {
      'gallery page status 200': (r) => r.status === 200,
      'gallery page loads quickly': (r) => r.timings.duration < 4000,
    }) || errorRate.add(1);

    sleep(1);

    // About page
    const aboutRes = http.get(`${BASE_URL}/about`);
    check(aboutRes, {
      'about page status 200': (r) => r.status === 200,
    }) || errorRate.add(1);

    sleep(0.5);
  });

  group('User Signup Flow', () => {
    // Load signup page
    const signupPageRes = http.get(`${BASE_URL}/signup`);
    check(signupPageRes, {
      'signup page status 200': (r) => r.status === 200,
    });

    sleep(1);

    // Submit signup form
    const signupStart = Date.now();
    const signupPayload = JSON.stringify({
      email: email,
      password: password,
      name: `Load Test User ${Date.now()}`,
    });

    const signupRes = http.post(`${BASE_URL}/api/auth/signup`, signupPayload, {
      headers: { 'Content-Type': 'application/json' },
    });
    signupTime.add(Date.now() - signupStart);

    const signupOk = check(signupRes, {
      'signup status 200 or 201': (r) => r.status === 200 || r.status === 201,
      'signup response has token': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.token || body.accessToken || body.session;
        } catch (e) {
          return false;
        }
      },
    });

    if (signupOk) {
      signupSuccess.add(1);
    } else {
      errorRate.add(1);
    }

    sleep(2);
  });

  group('User Login Flow', () => {
    // Load signin page
    const signinPageRes = http.get(`${BASE_URL}/signin`);
    check(signinPageRes, {
      'signin page status 200': (r) => r.status === 200,
    });

    sleep(1);

    // Submit login form
    const loginStart = Date.now();
    const loginPayload = JSON.stringify({
      email: email,
      password: password,
    });

    const loginRes = http.post(`${BASE_URL}/api/auth/signin`, loginPayload, {
      headers: { 'Content-Type': 'application/json' },
    });
    loginTime.add(Date.now() - loginStart);

    const loginOk = check(loginRes, {
      'login status 200': (r) => r.status === 200,
      'login returns token': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.token || body.accessToken || body.session;
        } catch (e) {
          return false;
        }
      },
    });

    if (loginOk) {
      loginSuccess.add(1);

      // Extract auth token for authenticated requests
      let authToken = '';
      try {
        const body = JSON.parse(loginRes.body);
        authToken = body.token || body.accessToken || '';
      } catch (e) {
        // Ignore parse errors
      }

      if (authToken) {
        group('Authenticated Actions', () => {
          const authHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          };

          // Access dashboard
          const dashboardRes = http.get(`${BASE_URL}/dashboard`, {
            headers: authHeaders,
          });
          check(dashboardRes, {
            'dashboard accessible': (r) => r.status === 200,
          }) || errorRate.add(1);

          sleep(1);

          // Browse gallery authenticated
          const authGalleryRes = http.get(`${BASE_URL}/gallery`, {
            headers: authHeaders,
          });
          check(authGalleryRes, {
            'authenticated gallery status 200': (r) => r.status === 200,
          }) || errorRate.add(1);

          sleep(1);

          // Submit work (simulated)
          const submitPayload = JSON.stringify({
            title: `Load Test Submission ${Date.now()}`,
            description: 'Automated load test submission',
            category: 'Photography',
          });

          const submitRes = http.post(`${BASE_URL}/api/gallery/submit`, submitPayload, {
            headers: authHeaders,
          });
          check(submitRes, {
            'submission accepted': (r) => r.status === 200 || r.status === 201 || r.status === 202,
          }) || errorRate.add(1);

          sleep(2);
        });
      }
    } else {
      errorRate.add(1);
    }

    sleep(1);
  });

  group('API Endpoints', () => {
    // Gallery API listing
    const galleryApiRes = http.get(`${BASE_URL}/api/gallery`);
    check(galleryApiRes, {
      'gallery API status 200': (r) => r.status === 200,
      'gallery API response time': (r) => r.timings.duration < 2000,
    }) || errorRate.add(1);

    sleep(0.5);

    // Gallery search
    const searchRes = http.get(`${BASE_URL}/api/gallery?search=test&page=1`);
    check(searchRes, {
      'search API status 200': (r) => r.status === 200,
      'search API response time': (r) => r.timings.duration < 2000,
    }) || errorRate.add(1);

    sleep(0.5);

    // Collection endpoint
    const collectionRes = http.get(`${BASE_URL}/api/collections`);
    check(collectionRes, {
      'collections API status 200 or 404': (r) => r.status === 200 || r.status === 404,
    });

    sleep(1);
  });
}

export function handleSummary(data) {
  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
    'load-test-results.json': JSON.stringify(data, null, 2),
  };
}

function textSummary(data, opts) {
  // k6 built-in summary is used by default
  // This function is a placeholder for custom summary output
  return '';
}
