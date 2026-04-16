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
        const members = await Member.find({});
        const membersWithFines = await Promise.all(members.map(async (m) => {
          const transactions = await Transaction.find({ 
            memberId: m._id, 
            actualReturnDate: { $exists: false } 
          });
          const totalFine = transactions.reduce((acc, tx) => {
            const daysOverdue = Math.max(0, Math.floor((Date.now() - new Date(tx.dueDate).getTime()) / (1000 * 60 * 60 * 24)));
            return acc + (daysOverdue * 10);
          }, 0);
          return { ...m.toObject(), pendingFine: totalFine };
        }));
        return NextResponse.json(membersWithFines);
      case 'active':
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
