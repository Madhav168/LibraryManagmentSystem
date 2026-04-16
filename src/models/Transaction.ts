import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  assetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  serialNo: { type: String, required: true }, // Added as per instructions
  issueDate: { type: Date, required: true },
  dueDate: { type: Date, required: true }, // Set to 15 days from issueDate by default
  actualReturnDate: { type: Date },
  fineAmount: { type: Number, default: 0 },
  isFinePaid: { type: Boolean, default: false },
  remarks: { type: String },
}, { timestamps: true });

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
