import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Member from '@/models/Member';

export async function GET() {
  try {
    await dbConnect();
    const members = await Member.find({});
    return NextResponse.json(members);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    
    // Simple validation (Production ready)
    if (!data.firstName || !data.lastName || !data.aadhar || !data.membershipType || !data.startDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Calculate end date based on membership type if not provided
    if (!data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(start);
      if (data.membershipType === '6 Months') end.setMonth(start.getMonth() + 6);
      else if (data.membershipType === '1 Year') end.setFullYear(start.getFullYear() + 1);
      else if (data.membershipType === '2 Years') end.setFullYear(start.getFullYear() + 2);
      data.endDate = end;
    }

    const member = await Member.create(data);
    return NextResponse.json(member, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Aadhar number already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
