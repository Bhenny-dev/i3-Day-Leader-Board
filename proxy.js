// proxy.js
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors()); // allow browser CORS
app.use(express.json({ limit: '1mb' }));

// YOUR Apps Script URL:
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxO2B5SOWfN5NPmpJMYpWzo1msJ-SxoTEH7Wwpf-3_eynqgPeGhSjCXNgmWlzc-ceU/exec';

app.all('/', async (req, res) => {
  try {
    // Build target URL for GET with query params
    let targetUrl = APPS_SCRIPT_URL;
    if (req.method === 'GET') {
      const q = new URLSearchParams(req.query).toString();
      if (q) targetUrl += '?' + q;
    }

    // Forward request to Apps Script
    const forwardOptions = {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
      body: req.method === 'POST' ? JSON.stringify(req.body) : undefined,
    };

    const r = await fetch(targetUrl, forwardOptions);

    // Try to forward response body as JSON or text
    const txt = await r.text();
    res.set('Content-Type', 'application/json');
    res.status(r.status).send(txt);
  } catch (err) {
    console.error('Proxy error', err);
    res.status(500).json({ ok:false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log(`Proxy listening on :${PORT}`));
