import React from 'react';
import { Form } from '../../types/form';
import { Input } from '../ui/Input';

interface FormStyleEditorProps {
  form: Form;
  onUpdate: (updates: Partial<Form>) => void;
}

export function FormStyleEditor({ form, onUpdate }: FormStyleEditorProps) {
  const handleStylingUpdate = (updates: Partial<Form['styling']>) => {
    onUpdate({
      styling: { ...form.styling, ...updates }
    });
  };

  const handleSettingsUpdate = (updates: Partial<Form['settings']>) => {
    onUpdate({
      settings: { ...form.settings, ...updates }
    });
  };

  return (
    <div className="w-80 bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto">
      <h3 className="font-semibold text-gray-900 mb-4">Form Settings</h3>

      {/* Basic Info */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Basic Information</h4>
        <div className="space-y-3">
          <Input
            label="Form Title"
            value={form.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
          />
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={form.description || ''}
              onChange={(e) => onUpdate({ description: e.target.value })}
              rows={3}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              placeholder="Optional form description"
            />
          </div>
        </div>
      </div>

      {/* Styling */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Styling</h4>
        <div className="space-y-3">
          <Input
            label="Background Color"
            type="color"
            value={form.styling.backgroundColor}
            onChange={(e) => handleStylingUpdate({ backgroundColor: e.target.value })}
          />

          <Input
            label="Primary Color"
            type="color"
            value={form.styling.primaryColor}
            onChange={(e) => handleStylingUpdate({ primaryColor: e.target.value })}
          />

          <Input
            label="Secondary Color"
            type="color"
            value={form.styling.secondaryColor}
            onChange={(e) => handleStylingUpdate({ secondaryColor: e.target.value })}
          />

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Font Family</label>
            <select
              value={form.styling.fontFamily}
              onChange={(e) => handleStylingUpdate({ fontFamily: e.target.value })}
              className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <option value="Inter, sans-serif">Inter</option>
              <option value="Arial, sans-serif">Arial</option>
              <option value="Helvetica, sans-serif">Helvetica</option>
              <option value="Times New Roman, serif">Times New Roman</option>
              <option value="Georgia, serif">Georgia</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Font Size</label>
            <select
              value={form.styling.fontSize}
              onChange={(e) => handleStylingUpdate({ fontSize: e.target.value })}
              className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <option value="14px">Small (14px)</option>
              <option value="16px">Medium (16px)</option>
              <option value="18px">Large (18px)</option>
              <option value="20px">Extra Large (20px)</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Border Radius</label>
            <select
              value={form.styling.borderRadius}
              onChange={(e) => handleStylingUpdate({ borderRadius: e.target.value })}
              className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <option value="4px">Small (4px)</option>
              <option value="8px">Medium (8px)</option>
              <option value="12px">Large (12px)</option>
              <option value="16px">Extra Large (16px)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Form Settings */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Form Behavior</h4>
        <div className="space-y-3">
          <Input
            label="Submit Button Text"
            value={form.settings.submitText}
            onChange={(e) => handleSettingsUpdate({ submitText: e.target.value })}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Success Message</label>
            <textarea
              value={form.settings.successMessage}
              onChange={(e) => handleSettingsUpdate({ successMessage: e.target.value })}
              rows={2}
              className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            />
          </div>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={form.settings.allowMultiple}
              onChange={(e) => handleSettingsUpdate({ allowMultiple: e.target.checked })}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Allow multiple submissions</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={form.settings.requireLogin}
              onChange={(e) => handleSettingsUpdate({ requireLogin: e.target.checked })}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Require login to submit</span>
          </label>
        </div>
      </div>
    </div>
  );
}