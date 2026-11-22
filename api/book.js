// api/book.js - Secure 2026 Serverless Lead Intake Endpoint
// Defends against XSS, SQLi, Parameter Pollution, Bot Flooding, and Data Leakage

// Simple in-memory rate limiter per IP (resets on cold start)
const ipRequestCounts = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '') // Strip HTML tags to prevent XSS
    .replace(/javascript:/gi, '')
    .trim()
    .slice(0, 300);
}

function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return typeof email === 'string' && email.length <= 120 && emailRegex.test(email);
}

function isValidUrl(url) {
  if (typeof url !== 'string' || url.length > 200) return false;
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

module.exports = async (req, res) => {
  // 1. Strict Security Headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Access-Control-Allow-Origin', 'https://angle-studio-silk.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 2. HTTP Method Validation (Only POST allowed)
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method Not Allowed',
      message: 'Only POST requests are permitted.'
    });
  }

  // 3. IP-based Rate Limiting (Prevent DDoS & Spam Bombing)
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const clientData = ipRequestCounts.get(clientIp) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };

  if (now > clientData.resetTime) {
    clientData.count = 1;
    clientData.resetTime = now + RATE_LIMIT_WINDOW_MS;
  } else {
    clientData.count++;
  }
  ipRequestCounts.set(clientIp, clientData);

  if (clientData.count > MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      error: 'Too Many Requests',
      message: 'Submission limit reached. Please wait a minute before trying again.'
    });
  }

  try {
    const { name, email, website, spend, honeypot, source } = req.body || {};

    // 4. Anti-Bot Honeypot Defense
    if (honeypot) {
      // Silently accept without processing to discard bot activity without leaking bot detection
      return res.status(200).json({ success: true, message: 'Request received.' });
    }

    // 5. Input Sanitization & Validation
    const cleanName = sanitizeInput(name);
    const cleanEmail = sanitizeInput(email);
    const cleanWebsite = sanitizeInput(website);
    const cleanSpend = sanitizeInput(spend);
    const cleanSource = sanitizeInput(source || 'Website Modal');

    if (!cleanName || cleanName.length < 2) {
      return res.status(400).json({ error: 'Invalid Name', message: 'Please provide a valid full name.' });
    }

    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({ error: 'Invalid Email', message: 'Please provide a valid work email address.' });
    }

    if (!isValidUrl(cleanWebsite)) {
      return res.status(400).json({ error: 'Invalid Website', message: 'Please provide a valid brand store or website URL.' });
    }

    const validSpendTiers = ['under20k', '20k-50k', '50k-150k', '150k-plus'];
    const sanitizedSpendTier = validSpendTiers.includes(cleanSpend) ? cleanSpend : '50k-150k';

    // 6. Lead Capture & Confidential Processing
    const leadPayload = {
      name: cleanName,
      email: cleanEmail,
      website: cleanWebsite,
      spendTier: sanitizedSpendTier,
      source: cleanSource,
      timestamp: new Date().toISOString()
    };

    // Optional webhook forwarding if configured in Vercel environment variables:
    if (process.env.SLACK_WEBHOOK_URL) {
      try {
        await fetch(process.env.SLACK_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🎯 *New Strategy Call Lead via ANGLE Studio*\n• *Name:* ${cleanName}\n• *Email:* ${cleanEmail}\n• *Website:* ${cleanWebsite}\n• *Monthly Spend:* ${sanitizedSpendTier}\n• *Source:* ${cleanSource}`
          })
        });
      } catch (err) {
        // Silently capture error without exposing internal error stack to client
        console.error('Webhook notification error:', err.message);
      }
    }

    // 7. Secure Success Response (Never echo back internal sensitive info)
    return res.status(200).json({
      success: true,
      message: 'Your strategy session request has been securely received.'
    });

  } catch (error) {
    // Zero sensitive stack trace leakage
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An error occurred while securely processing your request.'
    });
  }
};
