/**
 * Background Monitoring Agent
 * Continuously monitors backend health and reports to AI agent
 * Run with: node src/monitoring/agent.js
 */

const https = require('https');
const http = require('http');

// Configuration - set via environment variables
const config = {
  endpoints: [
    {
      name: 'health',
      url: process.env.HEALTH_URL || 'http://localhost:3000/health',
      interval: 30000,
      timeout: 5000,
      critical: true
    },
    {
      name: 'ready',
      url: process.env.READY_URL || 'http://localhost:3000/ready',
      interval: 60000,
      timeout: 10000,
      critical: true
    },
    {
      name: 'metrics',
      url: process.env.METRICS_URL || 'http://localhost:3000/metrics',
      interval: 120000,
      timeout: 5000,
      critical: false
    }
  ],
  aiWebhook: process.env.AI_WEBHOOK_URL || null,
  slackWebhook: process.env.SLACK_WEBHOOK_URL || null,
  thresholds: {
    consecutiveFailures: 3,
    latencyWarning: 1000,
    latencyCritical: 5000
  }
};

const state = { checks: {}, incidents: [], startTime: Date.now() };

async function checkEndpoint(endpoint) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const url = new URL(endpoint.url);
    const client = url.protocol === 'https:' ? https : http;
    
    const req = client.get(endpoint.url, {
      timeout: endpoint.timeout,
      headers: { 'User-Agent': 'MonitoringAgent/1.0' }
    }, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const data = Buffer.concat(chunks).toString();
        resolve({
          success: res.statusCode >= 200 && res.statusCode < 300,
          statusCode: res.statusCode,
          latency: Date.now() - startTime,
          data: tryParseJSON(data),
          timestamp: new Date().toISOString()
        });
      });
    });
    
    req.on('error', (error) => resolve({
      success: false, error: error.message,
      latency: Date.now() - startTime,
      timestamp: new Date().toISOString()
    }));
    
    req.on('timeout', () => {
      req.destroy();
      resolve({ success: false, error: 'Timeout', latency: endpoint.timeout,
        timestamp: new Date().toISOString() });
    });
  });
}

function tryParseJSON(str) {
  try { return JSON.parse(str); } catch { return str; }
}

async function processResult(endpoint, result) {
  const checkState = state.checks[endpoint.name] || {
    consecutiveFailures: 0, lastSuccess: null, history: []
  };
  
  checkState.history.push(result);
  if (checkState.history.length > 100) checkState.history.shift();
  
  if (result.success) {
    if (checkState.consecutiveFailures >= config.thresholds.consecutiveFailures) {
      await sendAlert({ type: 'recovery', endpoint: endpoint.name,
        message: `Service ${endpoint.name} recovered`, details: result });
    }
    checkState.consecutiveFailures = 0;
    checkState.lastSuccess = result.timestamp;
    
    if (result.latency > config.thresholds.latencyCritical) {
      await sendAlert({ type: 'latency_critical', endpoint: endpoint.name,
        message: `Critical latency: ${result.latency}ms`, details: result });
    }
  } else {
    checkState.consecutiveFailures++;
    if (checkState.consecutiveFailures === config.thresholds.consecutiveFailures) {
      await sendAlert({ type: endpoint.critical ? 'critical' : 'warning',
        endpoint: endpoint.name,
        message: `Service ${endpoint.name} DOWN`, details: result });
    }
  }
  
  state.checks[endpoint.name] = checkState;
  const status = result.success ? '\x1b[32mOK\x1b[0m' : '\x1b[31mFAIL\x1b[0m';
  console.log(`[${new Date().toISOString()}] ${endpoint.name}: ${status} (${result.latency}ms)`);
}

async function sendAlert(alert) {
  console.log(`\n[ALERT] ${alert.type.toUpperCase()}: ${alert.message}\n`);
  state.incidents.push({ ...alert, timestamp: new Date().toISOString() });
  // Prevent memory leak - cap incidents history at 500
  if (state.incidents.length > 500) {
    state.incidents.shift();
  }
  
  if (config.aiWebhook) {
    try {
      await postJSON(config.aiWebhook, {
        event: 'backend_alert', alert,
        context: { service: 'the-gallery-journal',
          environment: process.env.NODE_ENV || 'development',
          uptime: Math.floor((Date.now() - state.startTime) / 1000) }
      });
    } catch (err) { console.error('AI webhook failed:', err.message); }
  }
  
  if (config.slackWebhook) {
    const emoji = { critical: ':rotating_light:', warning: ':warning:',
      recovery: ':white_check_mark:', latency_critical: ':snail:' }[alert.type] || ':bell:';
    try {
      await postJSON(config.slackWebhook, {
        text: `${emoji} *${alert.type.toUpperCase()}*\n${alert.message}`
      });
    } catch (err) { console.error('Slack webhook failed:', err.message); }
  }
}

async function postJSON(url, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    const body = JSON.stringify(data);
    const req = client.request(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, resolve);
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function startMonitoring(endpoint) {
  console.log(`Monitoring ${endpoint.name} every ${endpoint.interval}ms`);
  const run = async () => {
    const result = await checkEndpoint(endpoint);
    await processResult(endpoint, result);
  };
  run();
  setInterval(run, endpoint.interval);
}

function startStatusServer() {
  const port = process.env.AGENT_PORT || 3001;
  http.createServer((req, res) => {
    if (req.url === '/status') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        agent: 'monitoring-agent', status: 'running',
        uptime: Math.floor((Date.now() - state.startTime) / 1000),
        checks: Object.entries(state.checks).map(([name, s]) => ({
          name, consecutiveFailures: s.consecutiveFailures, lastSuccess: s.lastSuccess
        })),
        recentIncidents: state.incidents.slice(-10)
      }));
    } else { res.writeHead(404); res.end('Not found'); }
  }).listen(port, () => console.log(`Agent status on port ${port}`));
}

console.log('\n=== Backend Monitoring Agent ===');
console.log(`Started: ${new Date().toISOString()}\n`);
startStatusServer();
config.endpoints.forEach(startMonitoring);
