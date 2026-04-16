import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Asset from '@/models/Asset';
import Member from '@/models/Member';
import Transaction from '@/models/Transaction';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { assetId, memberId, remarks } = await request.json();
    
    if (!assetId || !memberId) {
      return NextResponse.json({ error: 'Missing Asset or Member ID' }, { status: 400 });
    }

    const asset = await Asset.findById(assetId);
    if (!asset || asset.availableCopies <= 0) {
      return NextResponse.json({ error: 'Asset not available' }, { status: 400 });
    }

    const member = await Member.findById(memberId);
    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Logic for Dates (Instruction 11: Return date cannot be more than 15 days)
    const issueDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(issueDate.getDate() + 15);

    // Create Transaction
    const transaction = await Transaction.create({
      assetId,
      memberId,
      serialNo: asset.serialNo, // Transfer serialNo from asset
      issueDate,
      dueDate,
      remarks
    });

    // Update Asset Availability
    asset.availableCopies -= 1;
    await asset.save();

    return NextResponse.json(transaction, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
