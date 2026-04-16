import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({}, { password: 0 }); // Don't return passwords
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, username, password, role } = await req.json();
    await connectDB();
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
    }

    const user = await User.create({ name, username, password, role });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, name, username, password, role, isActive } = await req.json();
    await connectDB();
    
    const updateData: any = { name, username, role, isActive };
    if (password) updateData.password = password;

    const user = await User.findByIdAndUpdate(id, updateData, { new: true });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
