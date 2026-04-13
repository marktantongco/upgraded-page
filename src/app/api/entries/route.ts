import { supabaseAdmin } from '@/lib/supabase-client';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/entries — Save a new AI prompt entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, result } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('ai_entries')
      .insert([{ prompt: prompt.trim(), result: result?.trim() || null }])
      .select('id, prompt, result, created_at')
      .single();

    if (error) {
      if (error.message.includes('does not exist')) {
        return NextResponse.json(
          { error: 'Table not found. Run the SQL setup first.', code: 'NEEDS_SETUP' },
          { status: 503 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, entry: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

// GET /api/entries — Fetch saved entries (newest first)
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('ai_entries')
      .select('id, prompt, result, created_at')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      if (error.message.includes('does not exist')) {
        return NextResponse.json({ entries: [], code: 'NEEDS_SETUP' });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ entries: data || [] });
  } catch {
    return NextResponse.json({ entries: [] });
  }
}
