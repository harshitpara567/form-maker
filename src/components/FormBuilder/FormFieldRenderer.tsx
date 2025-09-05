import React from 'react';
import { FormField } from '../../types/form';
import { Input } from '../ui/Input';

interface FormFieldRendererProps {
  field: FormField;
  value?: any;
  onChange: (value: any) => void;
  disabled?: boolean;
  error?: string;
}

export function FormFieldRenderer({
  field,
  value = '',
  onChange,
  disabled = false,
  error,
}: FormFieldRendererProps) {
  const commonProps = {
    id: field.id,
    required: field.required,
    disabled,
    style: {
      width: field.styling?.width,
      margin: field.styling?.margin,
      padding: field.styling?.padding,
      backgroundColor: field.styling?.backgroundColor,
      borderColor: field.styling?.borderColor,
      color: field.styling?.textColor,
      fontSize: field.styling?.fontSize,
    },
  };

  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            error={error}
            {...commonProps}
          />
        );

      case 'textarea':
        return (
          <div className="space-y-2">
            <textarea
              placeholder={field.placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              rows={4}
              className={`flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                error ? 'border-red-500 focus-visible:ring-red-500' : ''
              }`}
              {...commonProps}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'select':
        return (
          <div className="space-y-2">
            <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className={`flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                error ? 'border-red-500 focus-visible:ring-red-500' : ''
              }`}
              {...commonProps}
            >
              <option value="">{field.placeholder || 'Select an option'}</option>
              {field.options?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <label key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={field.id}
                    value={option}
                    checked={value === option}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    {...commonProps}
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <label key={index} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={option}
                    checked={Array.isArray(value) && value.includes(option)}
                    onChange={(e) => {
                      const currentValues = Array.isArray(value) ? value : [];
                      if (e.target.checked) {
                        onChange([...currentValues, option]);
                      } else {
                        onChange(currentValues.filter((v) => v !== option));
                      }
                    }}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    {...commonProps}
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'date':
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            error={error}
            {...commonProps}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderField()}
    </div>
  );
}