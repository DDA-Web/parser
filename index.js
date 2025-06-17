import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { load } from 'cheerio';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/parser', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing URL parameter' });
  }

  try {
    const response = await fetch(`https://mercury.postlight.com/parser?url=${encodeURIComponent(url)}`, {
      headers: {
        'x-api-key': 'demo'
      }
    });

    const data = await response.json();

    const $ = load(data.content || '');
    const textContent = $('body').text().replace(/\s+/g, ' ').trim();

    res.json({
      title: data.title || '',
      author: data.author || '',
      date: data.date_published || '',
      content: textContent
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
