import React from 'react';
import { useDrag } from 'react-dnd';
import { 
  Type, 
  Mail, 
  Hash, 
  AlignLeft, 
  ChevronDown, 
  CircleDot, 
  CheckSquare, 
  Calendar 
} from 'lucide-react';

interface FieldType {
  type: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const fieldTypes: FieldType[] = [
  {
    type: 'text',
    label: 'Text Field',
    icon: <Type className="h-4 w-4" />,
    description: 'Single line text input'
  },
  {
    type: 'email',
    label: 'Email',
    icon: <Mail className="h-4 w-4" />,
    description: 'Email address input'
  },
  {
    type: 'number',
    label: 'Number',
    icon: <Hash className="h-4 w-4" />,
    description: 'Numeric input'
  },
  {
    type: 'textarea',
    label: 'Text Area',
    icon: <AlignLeft className="h-4 w-4" />,
    description: 'Multi-line text input'
  },
  {
    type: 'select',
    label: 'Dropdown',
    icon: <ChevronDown className="h-4 w-4" />,
    description: 'Select from options'
  },
  {
    type: 'radio',
    label: 'Radio Buttons',
    icon: <CircleDot className="h-4 w-4" />,
    description: 'Single choice selection'
  },
  {
    type: 'checkbox',
    label: 'Checkboxes',
    icon: <CheckSquare className="h-4 w-4" />,
    description: 'Multiple choice selection'
  },
  {
    type: 'date',
    label: 'Date',
    icon: <Calendar className="h-4 w-4" />,
    description: 'Date picker input'
  }
];

interface DraggableFieldProps {
  field: FieldType;
}

function DraggableField({ field }: DraggableFieldProps) {
  const [{ isDragging }, drag] = useDrag({
    type: 'field',
    item: { type: field.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`p-3 bg-white border border-gray-200 rounded-lg cursor-grab hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center space-x-2 mb-1">
        <div className="text-blue-600">{field.icon}</div>
        <span className="font-medium text-sm text-gray-900">{field.label}</span>
      </div>
      <p className="text-xs text-gray-500">{field.description}</p>
    </div>
  );
}

export function FieldPalette() {
  return (
    <div className="w-64 bg-gray-50 p-4 border-r border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-4">Form Fields</h3>
      <div className="space-y-3">
        {fieldTypes.map((field) => (
          <DraggableField key={field.type} field={field} />
        ))}
      </div>
    </div>
  );
}