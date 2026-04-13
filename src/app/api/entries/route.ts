import sql from '@/lib/supabase-client';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/entries — Save a new AI prompt entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, result } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const [entry] = await sql`
      INSERT INTO ai_entries (prompt, result)
      VALUES (${prompt.trim()}, ${result?.trim() || null})
      RETURNING id, prompt, result, created_at
    `;

    return NextResponse.json({ success: true, entry }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    // Detect if table doesn't exist
    if (message.includes('does not exist') || message.includes('relation')) {
      return NextResponse.json(
        { error: 'Table not found. Run /api/setup first.', code: 'NEEDS_SETUP' },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET /api/entries — Fetch all saved entries (newest first)
export async function GET() {
  try {
    const entries = await sql`
      SELECT id, prompt, result, created_at
      FROM ai_entries
      ORDER BY created_at DESC
      LIMIT 50
    `;

    return NextResponse.json({ entries });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (message.includes('does not exist')) {
      return NextResponse.json({ entries: [], code: 'NEEDS_SETUP' }, { status: 503 });
    }
    return NextResponse.json({ entries: [] });
  }
}
