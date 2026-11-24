import mongoose from 'mongoose';

// A "Request a Demo" enquiry submitted from the Sales Soccer microsite.
const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    company: { type: String, required: true, trim: true, minlength: 2, maxlength: 150 },
    designation: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    workEmail: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    mobileNumber: { type: String, required: true, trim: true, maxlength: 20 },
    message: { type: String, trim: true, maxlength: 1000, default: '' },
    submittedAt: { type: Date, default: Date.now, index: true },
    source: { type: String, default: 'sales-soccer-microsite', maxlength: 60 },
    status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
  },
  { timestamps: true, versionKey: false },
);

leadSchema.index({ workEmail: 1, submittedAt: -1 });

export const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);
