import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Asset from '@/models/Asset';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const query = type ? { type } : {};
    
    const assets = await Asset.find(query);
    return NextResponse.json(assets);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    
    if (!data.title || !data.author || !data.category || !data.type || !data.serialNo || data.quantity === undefined) {
      return NextResponse.json({ error: 'Missing required fields (title, author, category, type, serialNo, quantity)' }, { status: 400 });
    }

    // Set available copies to total quantity on creation
    data.availableCopies = data.quantity;
    
    const asset = await Asset.create(data);
    return NextResponse.json(asset, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    await dbConnect();
    const { id, ...updateData } = await request.json();
    
    // Calculate new availableCopies based on change in quantity
    const oldAsset = await Asset.findById(id);
    if (!oldAsset) return NextResponse.json({ error: 'Asset not found' }, { status: 404 });

    const quantityDiff = updateData.quantity !== undefined ? updateData.quantity - oldAsset.quantity : 0;
    const newAvailable = oldAsset.availableCopies + quantityDiff;

    const asset = await Asset.findByIdAndUpdate(id, {
      ...updateData,
      availableCopies: Math.max(0, newAvailable)
    }, { new: true });

    return NextResponse.json(asset);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
