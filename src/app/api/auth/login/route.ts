import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { username, password } = await request.json();

    // In this specific placement task, we use hardcoded credentials adm/adm and user/user
    // but we will check our DB first in case they were seeded.
    const user = await User.findOne({ username, password });

    if (!user) {
      // Fallback for demo if not seeded yet
      if ((username === 'adm' && password === 'adm') || (username === 'user' && password === 'user')) {
        return NextResponse.json({
          id: username === 'adm' ? 'admin-id' : 'user-id',
          username,
          role: username === 'adm' ? 'Admin' : 'User',
          name: username === 'adm' ? 'Administrator' : 'Standard User'
        });
      }
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (!user.isActive) {
      return NextResponse.json({ error: 'User is inactive' }, { status: 403 });
    }

    return NextResponse.json({
      id: user._id,
      username: user.username,
      role: user.role,
      name: user.name
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
