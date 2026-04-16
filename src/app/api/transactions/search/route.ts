import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Asset from '@/models/Asset';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const queryStr = searchParams.get('q');
    const title = searchParams.get('title');
    const author = searchParams.get('author');
    
    let query: any = {};
    if (title) query.title = { $regex: title, $options: 'i' };
    if (author) query.author = { $regex: author, $options: 'i' };

    const assets = await Asset.find(query);
    return NextResponse.json(assets);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
