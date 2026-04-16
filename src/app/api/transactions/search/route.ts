import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Asset from '@/models/Asset';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const queryStr = searchParams.get('q');
    
    if (!queryStr) {
      const all = await Asset.find({});
      return NextResponse.json(all);
    }

    // Search by title or author
    const assets = await Asset.find({
      $or: [
        { title: { $regex: queryStr, $options: 'i' } },
        { author: { $regex: queryStr, $options: 'i' } },
        { category: { $regex: queryStr, $options: 'i' } },
      ]
    });
    
    return NextResponse.json(assets);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
