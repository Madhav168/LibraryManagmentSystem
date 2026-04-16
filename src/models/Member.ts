import mongoose from 'mongoose';

const MemberSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  contactName: { type: String },
  contactAddress: { type: String },
  aadhar: { type: String, required: true, unique: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  membershipType: { 
    type: String, 
    enum: ['6 Months', '1 Year', '2 Years'], 
    required: true 
  },
}, { timestamps: true });

export default mongoose.models.Member || mongoose.model('Member', MemberSchema);
