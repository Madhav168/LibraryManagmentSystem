import mongoose from 'mongoose';

const AssetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true }, // e.g., Science, Fiction, etc.
  type: { type: String, enum: ['Book', 'Movie'], required: true },
  quantity: { type: Number, required: true },
  availableCopies: { type: Number, required: true },
  procurementDate: { type: Date, required: true },
}, { timestamps: true });

export default mongoose.models.Asset || mongoose.model('Asset', AssetSchema);
