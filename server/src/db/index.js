const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('PostgreSQL database connection error:', err);
});

/**
 * Query the database
 * @param {string} text - The SQL query
 * @param {Array} params - The parameters for the query
 * @returns {Promise} - The result of the query
 */
const query = async (text, params) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log('Executed query', { text, duration, rows: res.rowCount });
  return res;
};

/**
 * Get a client from the pool
 * @returns {Promise} - A client from the pool
 */
const getClient = async () => {
  const client = await pool.connect();
  const originalQuery = client.query;
  const release = client.release;

  // Set a timeout of 5 seconds on the client query
  client.query = (...args) => {
    client.lastQuery = args;
    return originalQuery.apply(client, args);
  };

  // Override the release method to log release
  client.release = () => {
    client.query = originalQuery;
    release.apply(client);
    console.log('Client released back to pool');
  };

  return client;
};

module.exports = {
  query,
  getClient,
  pool
};
