import React, { useState } from 'react';
import { Form, FormField } from '../../types/form';
import { FormFieldRenderer } from './FormFieldRenderer';
import { Button } from '../ui/Button';

interface FormPreviewProps {
  form: Form;
}

export function FormPreview({ form }: FormPreviewProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => ({ ...prev, [fieldId]: '' }));
    }
  };

  const validateForm = () => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Form submitted:', formData);
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank you!</h2>
        <p className="text-gray-600 mb-6">{form.settings.successMessage}</p>
        <Button onClick={() => setIsSubmitted(false)}>Submit Another Response</Button>
      </div>
    );
  }

  return (
    <div
      className="max-w-2xl mx-auto p-6 rounded-lg"
      style={{
        backgroundColor: form.styling.backgroundColor,
        fontFamily: form.styling.fontFamily,
        fontSize: form.styling.fontSize,
      }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{form.title}</h1>
        {form.description && (
          <p className="text-gray-600">{form.description}</p>
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
          className="w-full"
          style={{
            backgroundColor: form.styling.primaryColor,
            borderRadius: form.styling.borderRadius,
          }}
        >
          {form.settings.submitText}
        </Button>
      </form>
    </div>
  );
}