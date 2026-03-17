const sql = require('mssql');

const config = {
  user: "sa",
  password: "Parker789",
  database: "",
  server: '172.23.10.59',
  pool: {
    max: 10,
    min: 2,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false,
    trustServerCertificate: true,
  }
};

// Singleton pool — connect once, reuse across all queries
let pool = null;

async function getPool() {
  if (!pool || !pool.connected) {
    pool = await sql.connect(config);
  }
  return pool;
}

exports.qurey = async (input) => {
  try {
    const p = await getPool();
    const result = await p.request().query(input);
    return result;
  } catch (err) {
    console.error('[mssql] qurey error:', err);
    throw err;
  }
};

exports.qureyP = async (queryString, params = {}) => {
  try {
    const p = await getPool();
    const request = p.request();
    for (const [key, value] of Object.entries(params)) {
      request.input(key, value);
    }
    const result = await request.query(queryString);
    return result;
  } catch (err) {
    console.error('[mssql] qureyP error:', err);
    throw err;
  }
};
