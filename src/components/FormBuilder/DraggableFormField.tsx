import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { FormField } from '../../types/form';
import { FormFieldRenderer } from './FormFieldRenderer';
import { Settings, X, GripVertical } from 'lucide-react';
import { Button } from '../ui/Button';

interface DraggableFormFieldProps {
  field: FormField;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<FormField>) => void;
  onRemove: () => void;
  onMove: (fieldId: string, newIndex: number) => void;
}

export function DraggableFormField({
  field,
  index,
  isSelected,
  onSelect,
  onUpdate,
  onRemove,
  onMove,
}: DraggableFormFieldProps) {
  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: 'form-field',
    item: { id: field.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'form-field',
    hover: (draggedItem: { id: string; index: number }) => {
      if (draggedItem.id !== field.id) {
        onMove(draggedItem.id, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => dragPreview(drop(node))}
      className={`group relative bg-white border rounded-lg p-4 transition-all ${
        isSelected
          ? 'border-blue-500 shadow-lg ring-1 ring-blue-500'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
      } ${isDragging ? 'opacity-50' : ''}`}
      style={{ width: field.styling?.width || '100%' }}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-2">
        <div
          ref={drag}
          className="flex items-center cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
        
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <FormFieldRenderer field={field} onChange={() => {}} disabled />

      {isSelected && (
        <div className="absolute -top-2 -left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
          Selected
        </div>
      )}
    </div>
  );
}