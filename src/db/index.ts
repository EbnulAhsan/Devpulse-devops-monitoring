import { Pool } from 'pg';
import config from '../config';

const pool = new Pool({
  connectionString: config.database_url,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const createTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'contributor',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT users_role_check CHECK (role IN ('contributor', 'maintainer'))
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS issues (
      id SERIAL PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      description TEXT NOT NULL,
      type VARCHAR(30) NOT NULL,
      status VARCHAR(30) NOT NULL DEFAULT 'open',
      reporter_id INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT issues_type_check CHECK (type IN ('bug', 'feature_request')),
      CONSTRAINT issues_status_check CHECK (status IN ('open', 'in_progress', 'resolved'))
    );
  `);
};

export default pool;

// config all the data file perfectly 



// import { Pool } from "pg";

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL, // ✅ direct env use
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// export const createTables = async () => {
//   await pool.query(`
//     CREATE TABLE IF NOT EXISTS users (
//       id SERIAL PRIMARY KEY,
//       name VARCHAR(100) NOT NULL,
//       email VARCHAR(150) UNIQUE NOT NULL,
//       password TEXT NOT NULL,
//       role VARCHAR(20) NOT NULL DEFAULT 'contributor',
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       CONSTRAINT users_role_check CHECK (role IN ('contributor', 'maintainer'))
//     );
//   `);

//   await pool.query(`
//     CREATE TABLE IF NOT EXISTS issues (
//       id SERIAL PRIMARY KEY,
//       title VARCHAR(150) NOT NULL,
//       description TEXT NOT NULL,
//       type VARCHAR(30) NOT NULL,
//       status VARCHAR(30) NOT NULL DEFAULT 'open',
//       reporter_id INTEGER NOT NULL,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//       CONSTRAINT issues_type_check CHECK (type IN ('bug', 'feature_request')),
//       CONSTRAINT issues_status_check CHECK (status IN ('open', 'in_progress', 'resolved'))
//     );
//   `);
// };

// export default pool;