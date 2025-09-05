import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Save, Eye, Settings, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { FieldPalette } from '../components/FormBuilder/FieldPalette';
import { FormCanvas } from '../components/FormBuilder/FormCanvas';
import { FormPreview } from '../components/FormBuilder/FormPreview';
import { FormStyleEditor } from '../components/FormBuilder/FormStyleEditor';
import { Form } from '../types/form';
import { apiClient } from '../utils/api';

export function FormBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<Form>({
    title: 'Untitled Form',
    description: '',
    fields: [],
    styling: {
      backgroundColor: '#ffffff',
      primaryColor: '#3B82F6',
      secondaryColor: '#8B5CF6',
      fontFamily: 'Inter, sans-serif',
      fontSize: '16px',
      borderRadius: '8px',
      spacing: '1rem',
    },
    settings: {
      submitText: 'Submit',
      successMessage: 'Thank you for your submission!',
      allowMultiple: true,
      requireLogin: false,
    },
    status: 'draft',
  });
  
  const [activeTab, setActiveTab] = useState<'build' | 'preview' | 'style'>('build');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      loadForm(id);
    }
  }, [id]);

  const loadForm = async (formId: string) => {
    try {
      setLoading(true);
      const loadedForm = await apiClient.getForm(formId);
      setForm(loadedForm);
    } catch (error) {
      console.error('Error loading form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      let savedForm;
      
      if (form._id) {
        savedForm = await apiClient.updateForm(form._id, form);
      } else {
        savedForm = await apiClient.createForm(form);
        setForm(savedForm);
        navigate(`/builder/${savedForm._id}`, { replace: true });
      }
      
      console.log('Form saved successfully');
    } catch (error) {
      console.error('Error saving form:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    try {
      setSaving(true);
      const updatedForm = { ...form, status: 'published' as const };
      
      let savedForm;
      if (form._id) {
        savedForm = await apiClient.updateForm(form._id, updatedForm);
      } else {
        savedForm = await apiClient.createForm(updatedForm);
      }
      
      setForm(savedForm);
      console.log('Form published successfully');
    } catch (error) {
      console.error('Error publishing form:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{form.title}</h1>
                <p className="text-sm text-gray-500">
                  {form.status === 'published' ? 'Published' : 'Draft'} • {form.fields.length} fields
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('build')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'build'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Build
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'preview'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </button>
                <button
                  onClick={() => setActiveTab('style')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'style'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Style
                </button>
              </div>

              <Button
                variant="outline"
                onClick={handleSave}
                loading={saving}
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>

              <Button
                onClick={handlePublish}
                loading={saving}
              >
                {form.status === 'published' ? 'Update' : 'Publish'}
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex">
          {activeTab === 'build' && (
            <>
              <FieldPalette />
              <FormCanvas
                fields={form.fields}
                onFieldsChange={(fields) => setForm({ ...form, fields })}
              />
            </>
          )}

          {activeTab === 'preview' && (
            <div className="flex-1 p-6 overflow-y-auto">
              <FormPreview form={form} />
            </div>
          )}

          {activeTab === 'style' && (
            <div className="flex-1 p-6 overflow-y-auto">
              <FormPreview form={form} />
              <FormStyleEditor
                form={form}
                onUpdate={(updates) => setForm({ ...form, ...updates })}
              />
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
}