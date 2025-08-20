require('dotenv').config();
const PORT = process.env.PORT || 5000;
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const isProd = process.env.NODE_ENV === 'production';
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
pool.connect()
  .then(() => console.log("✅ DB connected"))
  .catch(err => console.error("❌ DB connection error", err));


const app = express();
app.use(cors());
app.use(express.json());

// Inicjalizacja bazy
async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS notes (
      id SERIAL PRIMARY KEY,
      text TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log("✅ Tabela 'notes' gotowa");
}

// Endpoint GET
app.get('/api/notes', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, text, created_at FROM notes ORDER BY id DESC'
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'DB error' });
  }
});

// Endpoint POST
app.post('/api/notes', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'text required' });

  try {
    const { rows } = await pool.query(
      'INSERT INTO notes(text) VALUES($1) RETURNING *',
      [text]
    );
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'DB error' });
  }
});

// Testowy endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Beer Pixel Skeleton backend działa 🍺' });
});

// Start
init().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
