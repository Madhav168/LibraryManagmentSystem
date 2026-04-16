import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Asset from '@/models/Asset';

export async function GET() {
  try {
    await dbConnect();

    const [titles, authors] = await Promise.all([
      Asset.distinct('title'),
      Asset.distinct('author')
    ]);

    return NextResponse.json({ titles, authors });
  } catch (error: any) {
    console.error('Search Suggestions Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
