import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

// Render (and most cloud hosts) provide a single DATABASE_URL.
// Locally, we use the individual DB_* variables from .env.
const useUrl = Boolean(process.env.DATABASE_URL);

export const pool = useUrl
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // required for Render Postgres
    })
  : new Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL error:", err);
  process.exit(1);
});

export const query = (text, params) => pool.query(text, params);