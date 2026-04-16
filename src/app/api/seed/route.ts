import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Asset from '@/models/Asset';
import Member from '@/models/Member';

export async function GET() {
  try {
    await dbConnect();

    // Clear existing (CAUTION: Only for demo)
    await User.deleteMany({});
    await Asset.deleteMany({});
    await Member.deleteMany({});

    // Create Users
    await User.create([
      { name: 'Admin User', username: 'adm', password: 'adm', role: 'Admin' },
      { name: 'Standard User', username: 'user', password: 'user', role: 'User' },
    ]);

    // Create Assets
    await Asset.create([
      { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', type: 'Book', quantity: 5, availableCopies: 5, procurementDate: new Date() },
      { title: 'Introduction to Algorithms', author: 'Cormen et al.', category: 'Science', type: 'Book', quantity: 3, availableCopies: 3, procurementDate: new Date() },
      { title: 'Inception', author: 'Christopher Nolan', category: 'Sci-Fi', type: 'Movie', quantity: 2, availableCopies: 2, procurementDate: new Date() },
    ]);

    // Create Members
    await Member.create([
      { firstName: 'John', lastName: 'Doe', aadhar: '123456789012', membershipType: '1 Year', startDate: new Date(), endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) },
      { firstName: 'Jane', lastName: 'Smith', aadhar: '987654321098', membershipType: '6 Months', startDate: new Date(), endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)) },
    ]);

    return NextResponse.json({ message: 'Database seeded successfully with adm/adm and user/user!' });
  } catch (error: any) {
    console.error('Seed Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
