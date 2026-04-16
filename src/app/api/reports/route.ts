import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Asset from '@/models/Asset';
import Member from '@/models/Member';
import Transaction from '@/models/Transaction';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (!type) return NextResponse.json({ error: 'Report type required' }, { status: 400 });

    switch (type) {
      case 'books':
        return NextResponse.json(await Asset.find({ type: 'Book' }));
      case 'movies':
        return NextResponse.json(await Asset.find({ type: 'Movie' }));
      case 'members':
        return NextResponse.json(await Member.find({}));
      case 'active_issues':
        return NextResponse.json(
          await Transaction.find({ actualReturnDate: { $exists: false } })
            .populate('assetId')
            .populate('memberId')
        );
      case 'overdue':
        const today = new Date();
        return NextResponse.json(
          await Transaction.find({
            actualReturnDate: { $exists: false },
            dueDate: { $lt: today }
          })
            .populate('assetId')
            .populate('memberId')
        );
      case 'pending':
        // Assuming transactions without issue date or similar. 
        // For this task, we'll return all active issues that haven't been fulfilled if we had a status field.
        // Since we don't have a separate 'Request' model, we return active issues as current placeholders.
        return NextResponse.json(
          await Transaction.find({ actualReturnDate: { $exists: false } })
            .populate('assetId')
            .populate('memberId')
        );
      default:
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
