import { supabaseAdmin } from '@/lib/supabase-client';
import { NextResponse } from 'next/server';

// GET /api/setup — Check if tables exist
export async function GET() {
  try {
    const { error: entriesError } = await supabaseAdmin
      .from('ai_entries')
      .select('id')
      .limit(1);

    const entriesReady = !entriesError || !entriesError.message.includes('does not exist');

    const { error: contactError } = await supabaseAdmin
      .from('contact_submissions')
      .select('id')
      .limit(1);

    const contactReady = !contactError || !contactError.message.includes('does not exist');

    return NextResponse.json({
      ai_entries: entriesReady,
      contact_submissions: contactReady,
      ready: entriesReady && contactReady,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ ready: false, error: message });
  }
}

// POST /api/setup — Returns SQL for the user to run in Supabase SQL Editor
export async function POST() {
  try {
    // Check current status first
    const { error: entriesError } = await supabaseAdmin
      .from('ai_entries')
      .select('id')
      .limit(1);

    const entriesReady = !entriesError || !entriesError.message.includes('does not exist');

    const { error: contactError } = await supabaseAdmin
      .from('contact_submissions')
      .select('id')
      .limit(1);

    const contactReady = !contactError || !contactError.message.includes('does not exist');

    if (entriesReady && contactReady) {
      return NextResponse.json({
        status: 'ready',
        message: 'All tables already exist and are ready to use.',
      });
    }

    return NextResponse.json({
      status: 'needs_sql',
      message: 'Tables need to be created. Run the SQL below in your Supabase SQL Editor.',
      sqlUrl: 'https://supabase.com/dashboard/project/hocjetqkgrptxdbsmmgx/sql',
      sql: `-- Paste this in your Supabase SQL Editor and click RUN:
-- https://supabase.com/dashboard/project/hocjetqkgrptxdbsmmgx/sql

CREATE TABLE IF NOT EXISTS ai_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt TEXT NOT NULL,
  result TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ai_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Allow public read entries" ON ai_entries FOR SELECT USING (true);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "Allow public insert entries" ON ai_entries FOR INSERT WITH CHECK (true);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "Allow public read contacts" ON contact_submissions FOR SELECT USING (true);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
DO $$ BEGIN
  CREATE POLICY "Allow public insert contacts" ON contact_submissions FOR INSERT WITH CHECK (true);
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_ai_entries_created_at ON ai_entries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions (created_at DESC);`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
