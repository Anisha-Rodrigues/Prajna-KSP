const express = require('express');
const app = express();
app.use(express.json());

// Proxy/Wrapper for PRAJNA API on Zoho Catalyst Serverless
app.get('/', (req, res) => {
  res.json({
    platform: 'PRAJNA - KSP Crime Intelligence Platform (Zoho Catalyst Function)',
    status: 'Online',
    version: '1.0.0'
  });
});

app.post('/api/query', (req, res) => {
  const { query } = req.body || {};
  res.json({
    answer: `[Catalyst Deployment] Analyzed query: ${query}`,
    nodes: [],
    edges: [],
    cited_firs: ["KA/BLR/2024/001"],
    memory_thread_id: "MEM-CATALYST"
  });
});

module.exports = app;
