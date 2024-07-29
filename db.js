const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'react',
  password: 'p@stgress',
  port: 5433, 
});

module.exports = pool;