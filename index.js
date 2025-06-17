import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import parser from '@postlight/parser'; // CommonJS module

const { Mercury } = parser;

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());

app.get('/parser', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing URL parameter' });
  }

  try {
    const result = await Mercury.parse(url);
    const $ = cheerio.load(result.content || '');
    const cleanText = $('body').text().replace(/\s+/g, ' ').trim();

    res.json({
      title: result.title || '',
      author: result.author || '',
      date: result.date_published || '',
      content: cleanText,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
