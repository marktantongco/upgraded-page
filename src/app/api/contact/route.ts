import sql from '@/lib/supabase-client';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/contact — Save a contact/waitlist submission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const [submission] = await sql`
      INSERT INTO contact_submissions (name, email, message)
      VALUES (${name.trim()}, ${email.trim()}, ${message?.trim() || null})
      RETURNING id, name, email, message, created_at
    `;

    return NextResponse.json({ success: true, submission }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    if (message.includes('does not exist')) {
      return NextResponse.json(
        { error: 'Table not found. Run /api/setup first.', code: 'NEEDS_SETUP' },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET /api/contact — Fetch all contact submissions
export async function GET() {
  try {
    const submissions = await sql`
      SELECT id, name, email, message, created_at
      FROM contact_submissions
      ORDER BY created_at DESC
      LIMIT 50
    `;

    return NextResponse.json({ submissions });
  } catch {
    return NextResponse.json({ submissions: [] });
  }
}
