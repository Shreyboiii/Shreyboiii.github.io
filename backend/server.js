import fetch from 'node-fetch';
import express from 'express';
import { URLSearchParams } from 'url';
const app = express();

app.use(express.json());

app.post('/instagram-token', async (req, res) => {
  console.log('Received request at /instagram-token');
  res.setHeader('Access-Control-Allow-Origin', 'https://shreyboiii.github.io');
  console.log('Content-Type:', req.headers['content-type']);
  console.log(req.body);
  console.log('Code received:', req.body.code);
  try {
    const response = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      body: new URLSearchParams({
        client_id: '1153807892876290',
        client_secret: '9b84f2f7aa39bd5e6618ab014fd13365',
        grant_type: 'authorization_code',
        redirect_uri: 'https://shreyboiii.github.io/igdata',
        code: req.body.code
      })
    });
    const data = await response.json();
    console.log('Access token received:', data);
    res.json(data);
  } catch (error) {
    console.error('Error fetching access token:', error);
    res.status(500).json({ error: 'Failed to fetch access token' });
  }
});

console.log('Listening at port 3000');
app.listen(3000);