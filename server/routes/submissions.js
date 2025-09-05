import express from 'express';
const router = express.Router();
import Submission from '../models/Submission.js';
import Form from '../models/Form.js';

// Get submissions for a form
router.get('/form/:formId', async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'submittedAt', sortOrder = 'desc' } = req.query;
    
    const submissions = await Submission.find({ formId: req.params.formId })
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('formId', 'title');

    const total = await Submission.countDocuments({ formId: req.params.formId });

    res.json({
      submissions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit form data
router.post('/:formId', async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    if (form.status !== 'published') {
      return res.status(400).json({ message: 'Form is not published' });
    }

    // Validate required fields
    const requiredFields = form.fields.filter(field => field.required);
    const missingFields = [];
    
    requiredFields.forEach(field => {
      if (!req.body.data[field.id] || req.body.data[field.id] === '') {
        missingFields.push(field.label);
      }
    });

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: 'Missing required fields', 
        fields: missingFields 
      });
    }

    const submission = new Submission({
      formId: req.params.formId,
      data: req.body.data,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    const savedSubmission = await submission.save();
    
    // Update form submission count
    await Form.findByIdAndUpdate(req.params.formId, {
      $inc: { submissionsCount: 1 }
    });

    res.status(201).json(savedSubmission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get single submission
router.get('/:id', async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('formId', 'title fields');
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete submission
router.delete('/:id', async (req, res) => {
  try {
    const submission = await Submission.findByIdAndDelete(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    
    // Update form submission count
    await Form.findByIdAndUpdate(submission.formId, {
      $inc: { submissionsCount: -1 }
    });
    
    res.json({ message: 'Submission deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Export submissions as CSV
router.get('/form/:formId/export', async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    const submissions = await Submission.find({ formId: req.params.formId })
      .sort({ submittedAt: -1 });

    // Create CSV content
    const headers = form.fields.map(field => field.label);
    headers.push('Submitted At');
    
    let csvContent = headers.join(',') + '\n';
    
    submissions.forEach(submission => {
      const row = form.fields.map(field => {
        const value = submission.data.get(field.id) || '';
        return `"${String(value).replace(/"/g, '""')}"`;
      });
      row.push(`"${submission.submittedAt.toISOString()}"`);
      csvContent += row.join(',') + '\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${form.title}_submissions.csv"`);
    res.send(csvContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;