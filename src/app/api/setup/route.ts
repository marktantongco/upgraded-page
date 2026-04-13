import { supabase } from '@/lib/supabase-client';
import { NextResponse } from 'next/server';

// POST /api/setup — Creates the required tables (run once)
export async function POST() {
  try {
    // Check if tables exist by trying to query them
    const { error: entriesError } = await supabase
      .from('ai_entries')
      .select('id')
      .limit(1);

    if (entriesError && entriesError.code === '42P01') {
      // Table doesn't exist — return SQL for manual creation
      return NextResponse.json({
        status: 'needs_setup',
        message: 'Tables need to be created. Please run the SQL in your Supabase SQL Editor.',
        sql: `
-- Run this in your Supabase SQL Editor
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

CREATE POLICY "Allow public read" ON ai_entries FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON ai_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read" ON contact_submissions FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON contact_submissions FOR INSERT WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_ai_entries_created_at ON ai_entries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions (created_at DESC);
        `.trim(),
      });
    }

    const { error: contactError } = await supabase
      .from('contact_submissions')
      .select('id')
      .limit(1);

    if (contactError && contactError.code === '42P01') {
      return NextResponse.json({
        status: 'partial_setup',
        message: 'ai_entries exists but contact_submissions is missing.',
        sql: `
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON contact_submissions FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions (created_at DESC);
        `.trim(),
      });
    }

    return NextResponse.json({
      status: 'ready',
      message: 'All tables are set up and ready to use.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ status: 'error', message }, { status: 500 });
  }
}

// GET /api/setup — Check current setup status
export async function GET() {
  try {
    const { error: entriesError } = await supabase
      .from('ai_entries')
      .select('id')
      .limit(1);

    const entriesReady = !entriesError || entriesError.code !== '42P01';

    const { error: contactError } = await supabase
      .from('contact_submissions')
      .select('id')
      .limit(1);

    const contactReady = !contactError || contactError.code !== '42P01';

    return NextResponse.json({
      ai_entries: entriesReady,
      contact_submissions: contactReady,
      ready: entriesReady && contactReady,
    });
  } catch {
    return NextResponse.json({
      ai_entries: false,
      contact_submissions: false,
      ready: false,
      error: 'Cannot connect to Supabase. Check environment variables.',
    });
  }
}
