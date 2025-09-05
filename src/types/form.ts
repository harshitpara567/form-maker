export interface FormField {
  id: string;
  type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
  };
  styling?: {
    width?: string;
    margin?: string;
    padding?: string;
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    fontSize?: string;
  };
  position?: {
    x: number;
    y: number;
  };
}

export interface FormStyling {
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSize: string;
  borderRadius: string;
  spacing: string;
}

export interface FormSettings {
  submitText: string;
  successMessage: string;
  allowMultiple: boolean;
  requireLogin: boolean;
}

export interface Form {
  _id?: string;
  title: string;
  description?: string;
  fields: FormField[];
  styling: FormStyling;
  settings: FormSettings;
  status: 'draft' | 'published' | 'archived';
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  submissionsCount?: number;
}

export interface Submission {
  _id: string;
  formId: string;
  data: Record<string, any>;
  submittedAt: Date;
  ipAddress?: string;
  userAgent?: string;
  submittedBy?: string;
}

export interface FormAnalytics {
  totalSubmissions: number;
  submissionsByDate: Record<string, number>;
  averagePerDay: number;
  lastSubmission: Date | null;
}