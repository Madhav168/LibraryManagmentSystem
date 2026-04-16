import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Asset from '@/models/Asset';
import Member from '@/models/Member';
import Category from '@/models/Category';
import Transaction from '@/models/Transaction';

import mongoose from 'mongoose';

export async function GET(request: Request) {
  try {
    await dbConnect();

    // Force refresh models from cache to recognize schema changes
    if (mongoose.models.Asset) delete mongoose.models.Asset;
    if (mongoose.models.Transaction) delete mongoose.models.Transaction;
    if (mongoose.models.Member) delete mongoose.models.Member;
    if (mongoose.models.Category) delete mongoose.models.Category;

    const { searchParams } = new URL(request.url);
    const force = searchParams.get('force') === 'true';

    // Count existing data
    const userCount = await User.countDocuments();
    
    if (userCount > 0 && !force) {
      return NextResponse.json({ 
        message: 'Database already has data. Seeding skipped. Use /api/seed?force=true to reset.',
        stats: {
          users: userCount,
          assets: await Asset.countDocuments(),
          members: await Member.countDocuments(),
          categories: await Category.countDocuments(),
          transactions: await Transaction.countDocuments()
        }
      });
    }

    // Full Reset
    await User.deleteMany({});
    await Asset.deleteMany({});
    await Member.deleteMany({});
    await Category.deleteMany({});
    await Transaction.deleteMany({});

    // 1. Create Categories
    const categories = await Category.create([
      { name: 'Science', prefix: 'SC', codeFrom: 'SC(B/M)000001', codeTo: 'SC(B/M)000004' },
      { name: 'Economics', prefix: 'EC', codeFrom: 'EC(B/M)000001', codeTo: 'EC(B/M)000004' },
      { name: 'Fiction', prefix: 'FC', codeFrom: 'FC(B/M)000001', codeTo: 'FC(B/M)000004' },
      { name: 'Children', prefix: 'CH', codeFrom: 'CH(B/M)000001', codeTo: 'CH(B/M)000004' },
      { name: 'Personal Development', prefix: 'PD', codeFrom: 'PD(B/M)000001', codeTo: 'PD(B/M)000004' },
    ]);

    // 2. Create Users (6 users)
    await User.create([
      { name: 'Admin One', username: 'adm', password: 'adm', role: 'Admin', isActive: true },
      { name: 'Admin Two', username: 'admin2', password: 'admin', role: 'Admin', isActive: true },
      { name: 'Admin Three', username: 'admin3', password: 'admin', role: 'Admin', isActive: true },
      { name: 'User One', username: 'user', password: 'user', role: 'User', isActive: true },
      { name: 'User Two', username: 'user2', password: 'user', role: 'User', isActive: true },
      { name: 'User Three', username: 'user3', password: 'user', role: 'User', isActive: true },
    ]);

    // 3. Create Assets (15 assets - mix of Books and Movies)
    const assetsCreated = await Asset.create([
      { title: 'A Brief History of Time', author: 'Stephen Hawking', serialNo: 'SCB000001', type: 'Book', category: 'Science', quantity: 5, availableCopies: 5, procurementDate: new Date(), cost: 450 },
      { title: 'The Universe in a Nutshell', author: 'Stephen Hawking', serialNo: 'SCB000002', type: 'Book', category: 'Science', quantity: 3, availableCopies: 0, procurementDate: new Date(), cost: 550 },
      { title: 'Cosmos', author: 'Carl Sagan', serialNo: 'SCM000001', type: 'Movie', category: 'Science', quantity: 2, availableCopies: 2, procurementDate: new Date(), cost: 900 },
      
      { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', serialNo: 'FCB000001', type: 'Book', category: 'Fiction', quantity: 10, availableCopies: 8, procurementDate: new Date(), cost: 300 },
      { title: '1984', author: 'George Orwell', serialNo: 'FCB000002', type: 'Book', category: 'Fiction', quantity: 7, availableCopies: 5, procurementDate: new Date(), cost: 350 },
      { title: 'Pulp Fiction', author: 'Quentin Tarantino', serialNo: 'FCM000001', type: 'Movie', category: 'Fiction', quantity: 4, availableCopies: 4, procurementDate: new Date(), cost: 1200 },

      { title: 'Capital in the 21st Century', author: 'Thomas Piketty', serialNo: 'ECB000001', type: 'Book', category: 'Economics', quantity: 3, availableCopies: 2, procurementDate: new Date(), cost: 1500 },
      { title: 'The Wealth of Nations', author: 'Adam Smith', serialNo: 'ECB000002', type: 'Book', category: 'Economics', quantity: 5, availableCopies: 5, procurementDate: new Date(), cost: 800 },
      { title: 'Freakonomics', author: 'Steven Levitt', serialNo: 'ECM000001', type: 'Movie', category: 'Economics', quantity: 2, availableCopies: 1, procurementDate: new Date(), cost: 700 },

      { title: 'The Lion King', author: 'Disney', serialNo: 'CHM000001', type: 'Movie', category: 'Children', quantity: 5, availableCopies: 5, procurementDate: new Date(), cost: 600 },
      { title: 'Harry Potter', author: 'J.K. Rowling', serialNo: 'CHB000001', type: 'Book', category: 'Children', quantity: 12, availableCopies: 10, procurementDate: new Date(), cost: 450 },
      { title: 'Toy Story', author: 'Pixar', serialNo: 'CHM000002', type: 'Movie', category: 'Children', quantity: 3, availableCopies: 3, procurementDate: new Date(), cost: 700 },

      { title: 'Atomic Habits', author: 'James Clear', serialNo: 'PDB000001', type: 'Book', category: 'Personal Development', quantity: 15, availableCopies: 12, procurementDate: new Date(), cost: 400 },
      { title: 'Deep Work', author: 'Cal Newport', serialNo: 'PDB000002', type: 'Book', category: 'Personal Development', quantity: 8, availableCopies: 8, procurementDate: new Date(), cost: 500 },
      { title: 'The Secret', author: 'Rhonda Byrne', serialNo: 'PDM000001', type: 'Movie', category: 'Personal Development', quantity: 2, availableCopies: 2, procurementDate: new Date(), cost: 900 },
    ]);

    // 4. Create Members (10 members)
    const membersCreated = await Member.create([
      { firstName: 'John', lastName: 'Doe', aadhar: '111122223333', contactName: 'Self', contactAddress: 'City View', membershipType: '1 Year', startDate: new Date('2024-01-01'), endDate: new Date('2025-01-01') },
      { firstName: 'Jane', lastName: 'Smith', aadhar: '444455556666', contactName: 'Self', contactAddress: 'Green Valley', membershipType: '6 Months', startDate: new Date('2024-03-01'), endDate: new Date('2024-09-01') },
      { firstName: 'Alice', lastName: 'Johnson', aadhar: '777788889999', contactName: 'Self', contactAddress: 'Oak Ridge', membershipType: '2 Years', startDate: new Date('2023-01-01'), endDate: new Date('2025-01-01') },
      { firstName: 'Bob', lastName: 'Williams', aadhar: '123412341234', contactName: 'Self', contactAddress: 'River Side', membershipType: '1 Year', startDate: new Date('2024-02-15'), endDate: new Date('2025-02-15') },
      { firstName: 'Charlie', lastName: 'Brown', aadhar: '987698769876', contactName: 'Self', contactAddress: 'Meadow Park', membershipType: '6 Months', startDate: new Date('2024-04-01'), endDate: new Date('2024-10-01') },
      { firstName: 'Diana', lastName: 'Prince', aadhar: '555544443333', contactName: 'Self', contactAddress: 'Amazon Heights', membershipType: '1 Year', startDate: new Date('2024-05-01'), endDate: new Date('2025-05-01') },
      { firstName: 'Ethan', lastName: 'Hunt', aadhar: '999988887777', contactName: 'Self', contactAddress: 'Mission Point', membershipType: '2 Years', startDate: new Date('2023-06-01'), endDate: new Date('2025-06-01') },
      { firstName: 'Fiona', lastName: 'Gallagher', aadhar: '666655554444', contactName: 'Self', contactAddress: 'South Side', membershipType: '1 Year', startDate: new Date('2024-01-15'), endDate: new Date('2025-01-15') },
      { firstName: 'George', lastName: 'Costanza', aadhar: '222233334444', contactName: 'Self', contactAddress: 'New York Ave', membershipType: '6 Months', startDate: new Date('2024-02-01'), endDate: new Date('2024-08-01') },
      { firstName: 'Hannah', lastName: 'Montana', aadhar: '888877776666', contactName: 'Self', contactAddress: 'Malibu Tower', membershipType: '1 Year', startDate: new Date('2024-03-15'), endDate: new Date('2025-03-15') },
    ]);

    // 5. Create Transactions (15 transactions)
    // a. Active Issues (5 items currently with members)
    await Transaction.create([
      { assetId: assetsCreated[0]._id, memberId: membersCreated[0]._id, serialNo: assetsCreated[0].serialNo, issueDate: new Date(), dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) },
      { assetId: assetsCreated[3]._id, memberId: membersCreated[1]._id, serialNo: assetsCreated[3].serialNo, issueDate: new Date(), dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) },
      { assetId: assetsCreated[6]._id, memberId: membersCreated[2]._id, serialNo: assetsCreated[6].serialNo, issueDate: new Date(), dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) },
      { assetId: assetsCreated[9]._id, memberId: membersCreated[3]._id, serialNo: assetsCreated[9].serialNo, issueDate: new Date(), dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) },
      { assetId: assetsCreated[12]._id, memberId: membersCreated[4]._id, serialNo: assetsCreated[12].serialNo, issueDate: new Date(), dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) },
    ]);

    // b. Successfully Returned (5 history items)
    await Transaction.create([
      { assetId: assetsCreated[1]._id, memberId: membersCreated[5]._id, serialNo: assetsCreated[1].serialNo, issueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), actualReturnDate: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000), fineAmount: 0, isFinePaid: true },
      { assetId: assetsCreated[4]._id, memberId: membersCreated[6]._id, serialNo: assetsCreated[4].serialNo, issueDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), actualReturnDate: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000), fineAmount: 0, isFinePaid: true },
      { assetId: assetsCreated[7]._id, memberId: membersCreated[7]._id, serialNo: assetsCreated[7].serialNo, issueDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), actualReturnDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), fineAmount: 0, isFinePaid: true },
      { assetId: assetsCreated[10]._id, memberId: membersCreated[8]._id, serialNo: assetsCreated[10].serialNo, issueDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000), dueDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), actualReturnDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), fineAmount: 50, isFinePaid: true },
      { assetId: assetsCreated[13]._id, memberId: membersCreated[9]._id, serialNo: assetsCreated[13].serialNo, issueDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000), dueDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), actualReturnDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), fineAmount: 50, isFinePaid: true },
    ]);

    // c. Overdue Returns (5 items - tests the fine calculation logic)
    await Transaction.create([
      { assetId: assetsCreated[2]._id, memberId: membersCreated[0]._id, serialNo: assetsCreated[2].serialNo, issueDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
      { assetId: assetsCreated[5]._id, memberId: membersCreated[1]._id, serialNo: assetsCreated[5].serialNo, issueDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
      { assetId: assetsCreated[8]._id, memberId: membersCreated[2]._id, serialNo: assetsCreated[8].serialNo, issueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
      { assetId: assetsCreated[11]._id, memberId: membersCreated[3]._id, serialNo: assetsCreated[11].serialNo, issueDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), dueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { assetId: assetsCreated[14]._id, memberId: membersCreated[4]._id, serialNo: assetsCreated[14].serialNo, issueDate: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000), dueDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000) },
    ]);

    return NextResponse.json({ 
      message: 'Deep seeding complete! Database is now fully populated for testing.',
      stats: {
        users: 6,
        members: 10,
        assets: 15,
        categories: 5,
        transactions: 15
      }
    });
  } catch (error: any) {
    console.error('Seed Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
