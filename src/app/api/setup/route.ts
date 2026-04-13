import sql from '@/lib/supabase-client';
import { NextResponse } from 'next/server';

const CREATE_TABLES_SQL = `
-- Create ai_entries table
CREATE TABLE IF NOT EXISTS ai_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt TEXT NOT NULL,
  result TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE ai_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (idempotent)
DO $$ BEGIN
  DROP POLICY IF EXISTS "Allow public read entries" ON ai_entries;
  DROP POLICY IF EXISTS "Allow public insert entries" ON ai_entries;
  DROP POLICY IF EXISTS "Allow public read contacts" ON contact_submissions;
  DROP POLICY IF EXISTS "Allow public insert contacts" ON contact_submissions;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Create policies
CREATE POLICY "Allow public read entries" ON ai_entries FOR SELECT USING (true);
CREATE POLICY "Allow public insert entries" ON ai_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read contacts" ON contact_submissions FOR SELECT USING (true);
CREATE POLICY "Allow public insert contacts" ON contact_submissions FOR INSERT WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ai_entries_created_at ON ai_entries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions (created_at DESC);
`;

// POST /api/setup — Creates the required tables (run once from Vercel)
export async function POST() {
  try {
    if (!process.env.SUPABASE_DATABASE_URL) {
      return NextResponse.json(
        { error: 'SUPABASE_DATABASE_URL not configured' },
        { status: 500 }
      );
    }

    await sql.unsafe(CREATE_TABLES_SQL);

    return NextResponse.json({
      status: 'success',
      message: 'Tables created successfully: ai_entries, contact_submissions',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET /api/setup — Check current setup status
export async function GET() {
  try {
    if (!process.env.SUPABASE_DATABASE_URL) {
      return NextResponse.json({
        ready: false,
        error: 'SUPABASE_DATABASE_URL not configured',
      });
    }

    const entries = await sql`SELECT to_regclass('public.ai_entries') as exists`;
    const contacts = await sql`SELECT to_regclass('public.contact_submissions') as exists`;

    const entriesReady = entries[0]?.exists !== null;
    const contactsReady = contacts[0]?.exists !== null;

    if (!entriesReady || !contactsReady) {
      return NextResponse.json({
        ai_entries: entriesReady,
        contact_submissions: contactsReady,
        ready: false,
        message: !entriesReady && !contactsReady
          ? 'No tables found. POST to /api/setup to create them.'
          : 'Partial setup. POST to /api/setup to create missing tables.',
      });
    }

    // Get counts
    const entryCount = await sql`SELECT count(*)::int as count FROM ai_entries`;
    const contactCount = await sql`SELECT count(*)::int as count FROM contact_submissions`;

    return NextResponse.json({
      ai_entries: true,
      contact_submissions: true,
      ready: true,
      message: 'All tables are set up and ready.',
      counts: {
        ai_entries: entryCount[0]?.count || 0,
        contact_submissions: contactCount[0]?.count || 0,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      ready: false,
      error: message,
    });
  }
}
