import express from 'express';
const router = express.Router();
import Form from '../models/Form.js';
import Submission from '../models/Submission.js';

// Get all forms
router.get('/', async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const forms = await Form.find(filter)
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-fields.styling -styling');

    const total = await Form.countDocuments(filter);

    res.json({
      forms,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get form by ID
router.get('/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new form
router.post('/', async (req, res) => {
  try {
    const form = new Form(req.body);
    const savedForm = await form.save();
    res.status(201).json(savedForm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update form
router.put('/:id', async (req, res) => {
  try {
    const form = await Form.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    
    res.json(form);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete form
router.delete('/:id', async (req, res) => {
  try {
    const form = await Form.findByIdAndDelete(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    
    // Delete all submissions for this form
    await Submission.deleteMany({ formId: req.params.id });
    
    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Duplicate form
router.post('/:id/duplicate', async (req, res) => {
  try {
    const originalForm = await Form.findById(req.params.id);
    if (!originalForm) {
      return res.status(404).json({ message: 'Form not found' });
    }

    const duplicateForm = new Form({
      ...originalForm.toObject(),
      _id: undefined,
      title: `${originalForm.title} (Copy)`,
      status: 'draft',
      submissionsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const savedForm = await duplicateForm.save();
    res.status(201).json(savedForm);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get form analytics
router.get('/:id/analytics', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    const submissions = await Submission.find({ formId: req.params.id });
    
    // Calculate analytics
    const totalSubmissions = submissions.length;
    const submissionsByDate = {};
    
    submissions.forEach(submission => {
      const date = submission.submittedAt.toISOString().split('T')[0];
      submissionsByDate[date] = (submissionsByDate[date] || 0) + 1;
    });

    res.json({
      totalSubmissions,
      submissionsByDate,
      averagePerDay: totalSubmissions / Math.max(Object.keys(submissionsByDate).length, 1),
      lastSubmission: submissions.length > 0 ? submissions[submissions.length - 1].submittedAt : null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;