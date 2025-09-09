// server.js
const express = require('express');
const fetch = require('node-fetch'); // or native fetch if available
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'my_verify_token';
const ZAPIER_WEBHOOK = process.env.ZAPIER_WEBHOOK; // paste your Zapier Catch Hook here
const PORT = process.env.PORT || 3000;

app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verified');
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
});

app.post('/webhook', async (req, res) => {
  // forward incoming payload to Zapier catch hook
  try {
    await fetch(ZAPIER_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    // return 200 to Meta quickly
    res.sendStatus(200);
  } catch (err) {
    console.error('forward error', err);
    res.sendStatus(500);
  }
});

app.listen(PORT, ()=> console.log(`listening ${PORT}`));
