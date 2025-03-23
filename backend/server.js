import fetch from 'node-fetch';
import express from 'express';
const app = express();

app.use(express.json());

app.post('/instagram-token', async (req, res) => {
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
  res.json(data);
});

app.listen(3000);