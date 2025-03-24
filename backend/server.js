import fetch from 'node-fetch';
import express from 'express';
import { URLSearchParams } from 'url';
import dotenv from 'dotenv';
dotenv.config();
const app = express();

app.use(express.json());

app.options('/instagram-token', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://shreyboiii.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.sendStatus(200);
});

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
        client_id: process.env.INSTAGRAM_CLIENT_ID,
        client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
        code: req.body.code
      })
    });
    const data = await response.json();
    console.log('Short-lived access token received:', data);
    // Exchange the short-lived access token for a long-lived access token
    try {
      const longLivedTokenResponse = await fetch(`https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&access_token=${data.access_token}`);
      const longLivedTokenData = await longLivedTokenResponse.json();
      console.log('Long-lived access token received:', longLivedTokenData);
      const accessToken = longLivedTokenData.access_token;

      // Get User ID and Username
      try {
        const userResponse = await fetch(`https://graph.instagram.com/me?fields=id,user_id,username,name,account_type,profile_picture_url,followers_count,follows_count,media_count&access_token=${accessToken}`);
        const userData = await userResponse.json();
        console.log('User Data:', userData);

        // Get User Media
        try {
          const mediaResponse = await fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,username&access_token=${accessToken}`);
          const mediaData = await mediaResponse.json();
          console.log('User Media:', mediaData);

          res.json({ ...longLivedTokenData, userData, mediaData });
        } catch (mediaError) {
          console.error('Error fetching user media:', mediaError);
          res.status(500).json({ error: 'Failed to fetch user media' });
        }
      } catch (userError) {
        console.error('Error fetching user info:', userError);
        res.status(500).json({ error: 'Failed to fetch user info' });
      }
    } catch (error) {
      console.error('Error fetching long-lived access token:', error);
      res.status(500).json({ error: 'Failed to fetch long-lived access token' });
    }
  } catch (error) {
    console.error('Error fetching access token:', error);
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      console.error('Failed to parse JSON response. Raw error:', error);
      res.status(500).json({ error: 'Failed to fetch access token (JSON error)' });
    } else {
      res.status(500).json({ error: 'Failed to fetch access token' });
    }
  }
});

console.log('Listening at port 3000');
app.listen(3000);