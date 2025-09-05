import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  formId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Form',
    required: true 
  },
  data: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  submittedAt: { type: Date, default: Date.now },
  ipAddress: String,
  userAgent: String,
  submittedBy: String // if user authentication is implemented
});

// Index for faster queries
submissionSchema.index({ formId: 1, submittedAt: -1 });

export default mongoose.model('Submission', submissionSchema);