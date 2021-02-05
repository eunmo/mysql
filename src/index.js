const config = require('config');
const mysql = require('mysql');

const dbconfig = config.get('dbConfig');

const pool = mysql.createPool({
  connectionLimit: dbconfig.connectionLimit ?? 10, // important
  host: dbconfig.host,
  user: dbconfig.user,
  password: dbconfig.password,
  database: dbconfig.database,
  debug: false,
  timezone: 'UTC+0',
});

const exec = async (sql, values = null) => {
  try {
    return await new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
        }

        connection.query(sql, values, (error, results) => {
          connection.release();
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
    });
  } catch (err) {
    console.log(`Database error while handling ${sql}`); // eslint-disable-line no-console
    throw err;
  }
};

const dml = exec;

const insertMultiple = async (sql, values) => {
  return exec(sql, [values]);
};

const query = exec;

const queryOne = async (sql, values = null) => {
  const rows = await exec(sql, values);
  return rows.length > 0 ? rows[0] : null;
};

const cleanup = async () => {
  return new Promise((resolve, reject) => {
    pool.end((error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

module.exports = { dml, insertMultiple, query, queryOne, cleanup };
