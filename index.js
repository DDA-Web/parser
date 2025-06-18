import express from 'express';
import cors from 'cors';
import Mercury from '@postlight/parser';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());

app.get('/parser', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing URL parameter' });
  }

  try {
    const result = await Mercury.parse(url, {
      contentType: 'html' // <- cette option est OK à garder, elle aide à forcer l’analyse HTML brute
    });

    res.json({
      title: result.title || '',
      author: result.author || '',
      date: result.date_published || '',
      content: result.content || '',
    });
  } catch (error) {
    console.error('Parser error:', error);
    res.status(500).json({ error: 'Parsing failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
