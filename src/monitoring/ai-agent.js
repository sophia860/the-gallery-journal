/**
 * AI Agent Integration for Backend Monitoring
 * Receives alerts and provides intelligent incident analysis
 * Can be extended to integrate with OpenAI, Claude, or other LLM APIs
 */

const http = require('http');
const https = require('https');

// AI Agent Configuration
const config = {
  port: process.env.AI_AGENT_PORT || 3002,
  llmProvider: process.env.LLM_PROVIDER || 'openai',
  openaiKey: process.env.OPENAI_API_KEY || null,
  anthropicKey: process.env.ANTHROPIC_API_KEY || null,
  slackWebhook: process.env.SLACK_WEBHOOK_URL || null,
  notifyChannels: ['slack', 'console']
};

// Incident memory for context
const incidentMemory = {
  recent: [],
  patterns: {},
  patternCount: 0 // Track count separately for O(1) operations
};

/**
 * Analyze incident with AI and generate insights
 */
async function analyzeIncident(alert) {
  const context = buildContext(alert);
  
  // Try to get AI analysis if API key available
  let aiAnalysis = null;
  if (config.openaiKey) {
    aiAnalysis = await getOpenAIAnalysis(context);
  } else if (config.anthropicKey) {
    aiAnalysis = await getAnthropicAnalysis(context);
  }
  
  // Fallback to rule-based analysis
  const analysis = aiAnalysis || getRuleBasedAnalysis(alert);
  
  // Store for pattern learning
  updatePatterns(alert, analysis);
  
  return {
    alert,
    analysis,
    recommendations: analysis.recommendations,
    severity: calculateSeverity(alert),
    timestamp: new Date().toISOString()
  };
}

function buildContext(alert) {
  return {
    currentIncident: alert,
    recentIncidents: incidentMemory.recent.slice(-10),
    knownPatterns: incidentMemory.patterns,
    systemPrompt: `You are an SRE assistant analyzing backend incidents for "the-gallery-journal" service.
Analyze the following alert and provide:
1. Likely root cause
2. Immediate actions to take
3. Long-term recommendations
4. Similar past incidents if relevant

Be concise and actionable.`
  };
}

async function getOpenAIAnalysis(context) {
  try {
    const response = await postJSON('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: [
        { role: 'system', content: context.systemPrompt },
        { role: 'user', content: JSON.stringify(context.currentIncident) }
      ],
      max_tokens: 500
    }, { 'Authorization': `Bearer ${config.openaiKey}` });
    
    return {
      source: 'openai',
      content: response.choices?.[0]?.message?.content || 'No analysis available',
      recommendations: extractRecommendations(response.choices?.[0]?.message?.content)
    };
  } catch (err) {
    console.error('OpenAI analysis failed:', err.message);
    return null;
  }
}

async function getAnthropicAnalysis(context) {
  try {
    const response = await postJSON('https://api.anthropic.com/v1/messages', {
      model: 'claude-3-sonnet-20240229',
      max_tokens: 500,
      system: context.systemPrompt,
      messages: [{ role: 'user', content: JSON.stringify(context.currentIncident) }]
    }, {
      'x-api-key': config.anthropicKey,
      'anthropic-version': '2023-06-01'
    });
    
    return {
      source: 'anthropic',
      content: response.content?.[0]?.text || 'No analysis available',
      recommendations: extractRecommendations(response.content?.[0]?.text)
    };
  } catch (err) {
    console.error('Anthropic analysis failed:', err.message);
    return null;
  }
}

function getRuleBasedAnalysis(alert) {
  const rules = {
    critical: {
      'health': {
        cause: 'Service process may have crashed or become unresponsive',
        actions: ['Check process status', 'Review recent deployments', 'Check system resources'],
        longTerm: ['Add process manager (PM2/systemd)', 'Implement auto-restart', 'Add more replicas']
      },
      'ready': {
        cause: 'One or more dependencies (DB, cache, storage) may be unavailable',
        actions: ['Check database connectivity', 'Verify cache service', 'Check storage access'],
        longTerm: ['Add circuit breakers', 'Implement fallback mechanisms', 'Add dependency health dashboards']
      }
    },
    latency_critical: {
      cause: 'High response times detected - possible resource exhaustion or network issues',
      actions: ['Check CPU/memory usage', 'Review slow queries', 'Check network latency'],
      longTerm: ['Add caching layers', 'Optimize queries', 'Scale horizontally']
    },
    recovery: {
      cause: 'Service has recovered from previous incident',
      actions: ['Verify full functionality', 'Check for data inconsistencies'],
      longTerm: ['Document incident timeline', 'Schedule post-mortem']
    }
  };
  
  const ruleSet = alert.type === 'critical' || alert.type === 'warning'
    ? rules.critical[alert.endpoint] || rules.critical.health
    : rules[alert.type] || rules.recovery;
  
  return {
    source: 'rules',
    likelyCause: ruleSet.cause,
    immediateActions: ruleSet.actions,
    recommendations: ruleSet.longTerm || []
  };
}

function extractRecommendations(text) {
  if (!text) return [];
  const lines = text.split('\n');
  return lines.filter(l => l.match(/^[\d\-\*]/) || l.toLowerCase().includes('recommend'));
}

function calculateSeverity(alert) {
  if (alert.type === 'critical') return 'P1';
  if (alert.type === 'warning' || alert.type === 'latency_critical') return 'P2';
  return 'P3';
}

function updatePatterns(alert, analysis) {
  incidentMemory.recent.push({ alert, analysis, timestamp: new Date() });
  if (incidentMemory.recent.length > 100) incidentMemory.recent.shift();
  
  const key = `${alert.type}:${alert.endpoint}`;
  
  // Check if we need to make room before adding a new pattern
  if (!incidentMemory.patterns[key] && incidentMemory.patternCount >= 1000) {
    // Remove the first pattern (oldest in insertion order for modern JS)
    const firstKey = Object.keys(incidentMemory.patterns)[0];
    delete incidentMemory.patterns[firstKey];
    incidentMemory.patternCount--;
  }
  
  // Update or create pattern
  if (!incidentMemory.patterns[key]) {
    incidentMemory.patterns[key] = 1;
    incidentMemory.patternCount++;
  } else {
    incidentMemory.patterns[key]++;
  }
}

/**
 * Send formatted notification
 */
async function sendNotification(incident) {
  const message = formatIncidentMessage(incident);
  
  console.log('\n' + '='.repeat(60));
  console.log(message);
  console.log('='.repeat(60) + '\n');
  
  if (config.slackWebhook) {
    try {
      await postJSON(config.slackWebhook, {
        blocks: formatSlackBlocks(incident)
      });
    } catch (err) {
      console.error('Slack notification failed:', err.message);
    }
  }
}

function formatIncidentMessage(incident) {
  const { alert, analysis, severity } = incident;
  return `
[${severity}] INCIDENT: ${alert.message}

Endpoint: ${alert.endpoint}
Type: ${alert.type}
Time: ${incident.timestamp}

ANALYSIS (${analysis.source}):
${analysis.likelyCause || analysis.content}

IMMEDIATE ACTIONS:
${(analysis.immediateActions || []).map(a => `  - ${a}`).join('\n')}

RECOMMENDATIONS:
${analysis.recommendations.map(r => `  - ${r}`).join('\n')}
  `.trim();
}

function formatSlackBlocks(incident) {
  const emoji = { P1: ':fire:', P2: ':warning:', P3: ':information_source:' };
  return [
    { type: 'header', text: { type: 'plain_text',
      text: `${emoji[incident.severity]} ${incident.severity} - ${incident.alert.endpoint}` } },
    { type: 'section', text: { type: 'mrkdwn', text: `*${incident.alert.message}*` } },
    { type: 'section', text: { type: 'mrkdwn',
      text: `*Analysis:*\n${incident.analysis.likelyCause || incident.analysis.content}` } },
    { type: 'section', text: { type: 'mrkdwn',
      text: `*Actions:*\n${(incident.analysis.immediateActions || []).map(a => `• ${a}`).join('\n')}` } }
  ];
}

async function postJSON(url, data, headers = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    const body = JSON.stringify(data);
    const req = client.request(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers }
    }, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const d = Buffer.concat(chunks).toString();
        try { resolve(JSON.parse(d)); } catch { resolve(d); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// Webhook server to receive alerts
http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/webhook') {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', async () => {
      try {
        const body = Buffer.concat(chunks).toString();
        const payload = JSON.parse(body);
        const incident = await analyzeIncident(payload.alert);
        await sendNotification(incident);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'processed', incident }));
      } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  } else if (req.url === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      agent: 'ai-agent', status: 'running',
      recentIncidents: incidentMemory.recent.length,
      patterns: incidentMemory.patterns
    }));
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
}).listen(config.port, () => {
  console.log(`\n=== AI Monitoring Agent ===`);
  console.log(`Webhook endpoint: http://localhost:${config.port}/webhook`);
  console.log(`Status endpoint: http://localhost:${config.port}/status`);
  console.log(`LLM Provider: ${config.llmProvider}`);
  console.log(`API Key configured: ${!!(config.openaiKey || config.anthropicKey)}\n`);
});
