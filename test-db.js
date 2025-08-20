require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.connect()
  .then(() => {
    console.log("✅ DB connected");
    pool.end();
  })
  .catch(err => console.error("❌ DB connection error:", err.message));
