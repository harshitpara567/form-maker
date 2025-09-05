import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { v4 as uuidv4 } from 'uuid';
import { FormField } from '../../types/form';
import { DraggableFormField } from './DraggableFormField';
import { FieldEditor } from './FieldEditor';

interface FormCanvasProps {
  fields: FormField[];
  onFieldsChange: (fields: FormField[]) => void;
}

export function FormCanvas({ fields, onFieldsChange }: FormCanvasProps) {
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  const [{ isOver }, drop] = useDrop({
    accept: 'field',
    drop: (item: { type: string }, monitor) => {
      const clientOffset = monitor.getClientOffset();
      if (clientOffset) {
        addField(item.type, clientOffset.x, clientOffset.y);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const addField = (type: string, x?: number, y?: number) => {
    const newField: FormField = {
      id: uuidv4(),
      type: type as any,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      placeholder: `Enter ${type}`,
      required: false,
      options: ['select', 'radio', 'checkbox'].includes(type) ? ['Option 1', 'Option 2'] : undefined,
      styling: {
        width: '100%',
        margin: '0 0 1rem 0',
      },
      position: x && y ? { x, y } : undefined,
    };

    onFieldsChange([...fields, newField]);
    setSelectedFieldId(newField.id);
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    onFieldsChange(
      fields.map((field) =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    );
  };

  const removeField = (fieldId: string) => {
    onFieldsChange(fields.filter((field) => field.id !== fieldId));
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null);
    }
  };

  const moveField = (fieldId: string, newIndex: number) => {
    const fieldIndex = fields.findIndex((field) => field.id === fieldId);
    const newFields = [...fields];
    const [movedField] = newFields.splice(fieldIndex, 1);
    newFields.splice(newIndex, 0, movedField);
    onFieldsChange(newFields);
  };

  const selectedField = fields.find((field) => field.id === selectedFieldId);

  return (
    <div className="flex flex-1">
      <div className="flex-1 p-6">
        <div
          ref={drop}
          className={`min-h-[600px] bg-white border-2 border-dashed rounded-lg p-6 ${
            isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
          }`}
        >
          {fields.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">📝</div>
                <p className="text-lg font-medium">Drag fields here to build your form</p>
                <p className="text-sm">Start by dragging a field from the left panel</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <DraggableFormField
                  key={field.id}
                  field={field}
                  index={index}
                  isSelected={selectedFieldId === field.id}
                  onSelect={() => setSelectedFieldId(field.id)}
                  onUpdate={(updates) => updateField(field.id, updates)}
                  onRemove={() => removeField(field.id)}
                  onMove={moveField}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedField && (
        <div className="w-80 bg-gray-50 border-l border-gray-200">
          <FieldEditor
            field={selectedField}
            onUpdate={(updates) => updateField(selectedField.id, updates)}
            onClose={() => setSelectedFieldId(null)}
          />
        </div>
      )}
    </div>
  );
}