const { Pool } = require('pg');
require('dotenv').config();

// Configuracion de Pool PostgreSQL usando variables de entorno seguras (Regla 9: Cero secretos en repo)
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'incident_hub_db',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

async function checkDatabaseHealth() {
  try {
    const res = await pool.query('SELECT NOW() AS current_time');
    return { connected: true, timestamp: res.rows[0].current_time };
  } catch (err) {
    return { connected: false, mode: 'in-memory-fallback', reason: err.message };
  }
}

module.exports = { pool, checkDatabaseHealth };