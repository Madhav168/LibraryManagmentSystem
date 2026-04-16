import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Asset from '@/models/Asset';
import Transaction from '@/models/Transaction';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { transactionId, isFinePaid } = await request.json();
    
    if (!transactionId) {
      return NextResponse.json({ error: 'Missing Transaction ID' }, { status: 400 });
    }

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    if (transaction.actualReturnDate) {
      return NextResponse.json({ error: 'Book already returned' }, { status: 400 });
    }

    const actualReturnDate = new Date();
    transaction.actualReturnDate = actualReturnDate;
    
    // Calculate Fine (Assumed ₹10/day from instructions/assumption)
    const dueDate = new Date(transaction.dueDate);
    if (actualReturnDate > dueDate) {
      const diffTime = Math.abs(actualReturnDate.getTime() - dueDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      transaction.fineAmount = diffDays * 10;
    }

    transaction.isFinePaid = isFinePaid || false;
    await transaction.save();

    // Increment Asset Availability
    const asset = await Asset.findById(transaction.assetId);
    if (asset) {
      asset.availableCopies += 1;
      await asset.save();
    }

    return NextResponse.json(transaction);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
