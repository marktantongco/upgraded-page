import postgres from 'postgres';

// Supabase PostgreSQL connection for server-side API routes
// This will work from Vercel's network (not sandboxed)
const sql = postgres(process.env.SUPABASE_DATABASE_URL!, {
  max: 3,
  idle_timeout: 20,
  connect_timeout: 10,
  ssl: 'require',
});

export default sql;
