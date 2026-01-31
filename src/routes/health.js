/**
 * Health Check Routes for Backend Monitoring
 * Provides /health (liveness) and /ready (readiness) endpoints
 */

const express = require('express');
const router = express.Router();

// Configuration
const config = {
  serviceName: process.env.SERVICE_NAME || 'the-gallery-journal',
  version: process.env.APP_VERSION || '1.0.0',
  environment: process.env.NODE_ENV || 'development'
};

// Track service start time for uptime calculation
const startTime = Date.now();

/**
 * GET /health - Liveness check
 * Quick check to verify the service process is running
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: config.serviceName,
    version: config.version,
    timestamp: new Date().toISOString(),
    uptime: Math.floor((Date.now() - startTime) / 1000)
  });
});

/**
 * GET /ready - Readiness check
 * Deep check verifying all dependencies are available
 */
router.get('/ready', async (req, res) => {
  const checks = {
    database: { status: 'unknown', latency: null },
    cache: { status: 'unknown', latency: null },
    storage: { status: 'unknown', latency: null }
  };
  
  let isReady = true;
  
  // Database check
  try {
    const dbStart = Date.now();
    // Replace with your actual database check
    // await db.query('SELECT 1');
    await simulateCheck('database');
    checks.database = {
      status: 'healthy',
      latency: Date.now() - dbStart
    };
  } catch (error) {
    checks.database = { status: 'unhealthy', error: error.message };
    isReady = false;
  }
  
  // Cache check (Redis, Memcached, etc.)
  try {
    const cacheStart = Date.now();
    // await redis.ping();
    await simulateCheck('cache');
    checks.cache = {
      status: 'healthy',
      latency: Date.now() - cacheStart
    };
  } catch (error) {
    checks.cache = { status: 'unhealthy', error: error.message };
    isReady = false;
  }
  
  // Storage check (S3, filesystem, etc.)
  try {
    const storageStart = Date.now();
    // await s3.headBucket({ Bucket: 'your-bucket' }).promise();
    await simulateCheck('storage');
    checks.storage = {
      status: 'healthy',
      latency: Date.now() - storageStart
    };
  } catch (error) {
    checks.storage = { status: 'unhealthy', error: error.message };
    isReady = false;
  }
  
  const response = {
    status: isReady ? 'ready' : 'not_ready',
    service: config.serviceName,
    version: config.version,
    environment: config.environment,
    timestamp: new Date().toISOString(),
    checks
  };
  
  res.status(isReady ? 200 : 503).json(response);
});

/**
 * GET /metrics - Basic metrics endpoint
 * Returns key performance indicators
 */
router.get('/metrics', (req, res) => {
  const metrics = {
    service: config.serviceName,
    uptime_seconds: Math.floor((Date.now() - startTime) / 1000),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    timestamp: new Date().toISOString()
  };
  
  res.status(200).json(metrics);
});

// Helper function to simulate checks (replace with real implementations)
async function simulateCheck(service) {
  return new Promise((resolve) => setTimeout(resolve, Math.random() * 10));
}

module.exports = router;
