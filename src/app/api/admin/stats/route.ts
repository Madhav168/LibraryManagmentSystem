import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Asset from '@/models/Asset';
import Member from '@/models/Member';
import Transaction from '@/models/Transaction';

export async function GET() {
  try {
    await dbConnect();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [totalAssets, activeUsers, dueToday, totalIssues] = await Promise.all([
      Asset.countDocuments(),
      Member.countDocuments(),
      Transaction.countDocuments({ 
        dueDate: { $gte: todayStart, $lte: todayEnd },
        actualReturnDate: { $exists: false }
      }),
      Transaction.countDocuments()
    ]);

    return NextResponse.json({
      totalAssets: totalAssets.toString(),
      activeUsers: activeUsers.toString(),
      dueToday: dueToday.toString(),
      totalIssues: totalIssues.toString()
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
