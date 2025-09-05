import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Submission } from '../types/form';
import { FormFieldRenderer } from '../components/FormBuilder/FormFieldRenderer';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { apiClient } from '../utils/api';

export function FormView() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<Form | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      loadForm(id);
    }
  }, [id]);

  const loadForm = async (formId: string) => {
    try {
      setLoading(true);
      const loadedForm = await apiClient.getForm(formId);
      
      if (loadedForm.status !== 'published') {
        throw new Error('Form is not published');
      }
      
      setForm(loadedForm);
    } catch (error) {
      console.error('Error loading form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: '' }));
    }
  };

  const validateForm = () => {
    if (!form) return false;
    
    const newErrors: Record<string, string> = {};

    form.fields.forEach((field) => {
      const value = formData[field.id];

      // Required field validation
      if (field.required && (!value || value === '' || (Array.isArray(value) && value.length === 0))) {
        newErrors[field.id] = `${field.label} is required`;
        return;
      }

      // Skip other validations if field is empty and not required
      if (!value) return;

      // String length validation
      if (field.validation?.minLength && typeof value === 'string' && value.length < field.validation.minLength) {
        newErrors[field.id] = `${field.label} must be at least ${field.validation.minLength} characters`;
      }

      if (field.validation?.maxLength && typeof value === 'string' && value.length > field.validation.maxLength) {
        newErrors[field.id] = `${field.label} must be no more than ${field.validation.maxLength} characters`;
      }

      // Number validation
      if (field.type === 'number') {
        const numValue = parseFloat(value);
        if (field.validation?.min !== undefined && numValue < field.validation.min) {
          newErrors[field.id] = `${field.label} must be at least ${field.validation.min}`;
        }
        if (field.validation?.max !== undefined && numValue > field.validation.max) {
          newErrors[field.id] = `${field.label} must be no more than ${field.validation.max}`;
        }
      }

      // Email validation
      if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors[field.id] = `${field.label} must be a valid email address`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form || !validateForm()) return;

    try {
      setSubmitting(true);
      await apiClient.submitForm(form._id!, formData);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading form...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Form Not Found</h2>
            <p className="text-gray-600">This form may have been deleted or is not published yet.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank you!</h2>
            <p className="text-gray-600 mb-6">{form.settings.successMessage}</p>
            {form.settings.allowMultiple && (
              <Button onClick={() => {
                setIsSubmitted(false);
                setFormData({});
                setErrors({});
              }}>
                Submit Another Response
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen py-12 px-4"
      style={{ backgroundColor: form.styling.backgroundColor }}
    >
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent 
            className="p-8"
            style={{
              fontFamily: form.styling.fontFamily,
              fontSize: form.styling.fontSize,
            }}
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{form.title}</h1>
              {form.description && (
                <p className="text-gray-600 text-lg">{form.description}</p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {form.fields.map((field) => (
                <FormFieldRenderer
                  key={field.id}
                  field={field}
                  value={formData[field.id]}
                  onChange={(value) => handleFieldChange(field.id, value)}
                  error={errors[field.id]}
                />
              ))}

              <Button
                type="submit"
                className="w-full py-3 text-lg"
                loading={submitting}
                style={{
                  backgroundColor: form.styling.primaryColor,
                  borderRadius: form.styling.borderRadius,
                }}
              >
                {form.settings.submitText}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}