import React, { useState, useEffect } from 'react';
import { FormField } from '../../types/form';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { X, Plus, Trash2 } from 'lucide-react';

interface FieldEditorProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
  onClose: () => void;
}

export function FieldEditor({ field, onUpdate, onClose }: FieldEditorProps) {
  const [localField, setLocalField] = useState(field);

  // Keep local state in sync when a different field is selected
  useEffect(() => {
    setLocalField(field);
  }, [field]);

  const handleUpdate = (updates: Partial<FormField>) => {
    const updated = { ...localField, ...updates };
    setLocalField(updated);
    onUpdate(updates);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(localField.options || [])];
    newOptions[index] = value;
    handleUpdate({ options: newOptions });
  };

  const addOption = () => {
    const newOptions = [...(localField.options || []), `Option ${(localField.options?.length || 0) + 1}`];
    handleUpdate({ options: newOptions });
  };

  const removeOption = (index: number) => {
    const newOptions = (localField.options || []).filter((_, i) => i !== index);
    handleUpdate({ options: newOptions });
  };

  const hasOptions = ['select', 'radio', 'checkbox'].includes(localField.type);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="font-medium text-gray-900">Field Settings</h3>
        <Button size="sm" variant="ghost" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Basic Settings */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Basic Settings</h4>
          <div className="space-y-3">
            <Input
              label="Label"
              value={localField.label}
              onChange={(e) => handleUpdate({ label: e.target.value })}
            />

            <Input
              label="Placeholder"
              value={localField.placeholder || ''}
              onChange={(e) => handleUpdate({ placeholder: e.target.value })}
            />

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={localField.required}
                onChange={(e) => handleUpdate({ required: e.target.checked })}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Required field</span>
            </label>
          </div>
        </div>

        {/* Options for select, radio, checkbox */}
        {hasOptions && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Options</h4>
            <div className="space-y-2">
              {localField.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeOption(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                size="sm"
                variant="outline"
                onClick={addOption}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </div>
          </div>
        )}

        {/* Styling */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Styling</h4>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Width</label>
              <select
                value={localField.styling?.width || '100%'}
                onChange={(e) => handleUpdate({ 
                  styling: { ...localField.styling, width: e.target.value }
                })}
                className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <option value="100%">Full Width</option>
                <option value="75%">75% Width</option>
                <option value="50%">Half Width</option>
                <option value="25%">Quarter Width</option>
              </select>
            </div>

            <Input
              label="Background Color"
              type="color"
              value={localField.styling?.backgroundColor || '#ffffff'}
              onChange={(e) => handleUpdate({ 
                styling: { ...localField.styling, backgroundColor: e.target.value }
              })}
            />

            <Input
              label="Border Color"
              type="color"
              value={localField.styling?.borderColor || '#d1d5db'}
              onChange={(e) => handleUpdate({ 
                styling: { ...localField.styling, borderColor: e.target.value }
              })}
            />

            <Input
              label="Text Color"
              type="color"
              value={localField.styling?.textColor || '#374151'}
              onChange={(e) => handleUpdate({ 
                styling: { ...localField.styling, textColor: e.target.value }
              })}
            />
          </div>
        </div>

        {/* Validation */}
        {(localField.type === 'text' || localField.type === 'textarea') && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Validation</h4>
            <div className="space-y-3">
              <Input
                label="Minimum Length"
                type="number"
                min="0"
                value={localField.validation?.minLength || ''}
                onChange={(e) => handleUpdate({ 
                  validation: { 
                    ...localField.validation, 
                    minLength: e.target.value ? parseInt(e.target.value) : undefined
                  }
                })}
              />

              <Input
                label="Maximum Length"
                type="number"
                min="0"
                value={localField.validation?.maxLength || ''}
                onChange={(e) => handleUpdate({ 
                  validation: { 
                    ...localField.validation, 
                    maxLength: e.target.value ? parseInt(e.target.value) : undefined
                  }
                })}
              />
            </div>
          </div>
        )}

        {localField.type === 'number' && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Number Validation</h4>
            <div className="space-y-3">
              <Input
                label="Minimum Value"
                type="number"
                value={localField.validation?.min || ''}
                onChange={(e) => handleUpdate({ 
                  validation: { 
                    ...localField.validation, 
                    min: e.target.value ? parseFloat(e.target.value) : undefined
                  }
                })}
              />

              <Input
                label="Maximum Value"
                type="number"
                value={localField.validation?.max || ''}
                onChange={(e) => handleUpdate({ 
                  validation: { 
                    ...localField.validation, 
                    max: e.target.value ? parseFloat(e.target.value) : undefined
                  }
                })}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}