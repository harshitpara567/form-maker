import mongoose from 'mongoose';

const fieldSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['text', 'email', 'number', 'textarea', 'select', 'radio', 'checkbox', 'date']
  },
  label: { type: String, required: true },
  placeholder: String,
  required: { type: Boolean, default: false },
  options: [String], // for select, radio, checkbox
  validation: {
    minLength: Number,
    maxLength: Number,
    min: Number,
    max: Number,
    pattern: String
  },
  styling: {
    width: { type: String, default: '100%' },
    margin: { type: String, default: '0 0 1rem 0' },
    padding: String,
    backgroundColor: String,
    borderColor: String,
    textColor: String,
    fontSize: String
  },
  position: {
    x: Number,
    y: Number
  }
}, { _id: false });

const formSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  fields: [fieldSchema],
  styling: {
    backgroundColor: { type: String, default: '#ffffff' },
    primaryColor: { type: String, default: '#3B82F6' },
    secondaryColor: { type: String, default: '#8B5CF6' },
    fontFamily: { type: String, default: 'Inter, sans-serif' },
    fontSize: { type: String, default: '16px' },
    borderRadius: { type: String, default: '8px' },
    spacing: { type: String, default: '1rem' }
  },
  settings: {
    submitText: { type: String, default: 'Submit' },
    successMessage: { type: String, default: 'Thank you for your submission!' },
    allowMultiple: { type: Boolean, default: true },
    requireLogin: { type: Boolean, default: false }
  },
  status: { 
    type: String, 
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  createdBy: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  submissionsCount: { type: Number, default: 0 }
});

// Update timestamp on save
formSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Form', formSchema);