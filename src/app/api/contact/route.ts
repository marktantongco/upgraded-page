import { supabase } from '@/lib/supabase-client';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/contact — Save a contact/waitlist submission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([{
        name: name.trim(),
        email: email.trim(),
        message: message?.trim() || null,
      }])
      .select()
      .single();

    if (error) {
      if (error.code === '42P01') {
        return NextResponse.json(
          { error: 'Table not found. Please run /api/setup first.', code: 'NEEDS_SETUP' },
          { status: 503 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, submission: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

// GET /api/contact — Fetch all contact submissions
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('id, name, email, message, created_at')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      if (error.code === '42P01') {
        return NextResponse.json(
          { error: 'Table not found.', submissions: [] },
          { status: 503 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ submissions: data || [] });
  } catch {
    return NextResponse.json({ submissions: [] });
  }
}
