import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, GripVertical, Settings } from 'lucide-react';

interface FormField {
  id: string;
  type: 'text' | 'email' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'number' | 'date';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select, checkbox, radio
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

interface Form {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  submitUrl?: string;
  submitButtonText: string;
}

interface FormBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (form: Form) => void;
  initialForm?: Form;
}

const FormBuilder: React.FC<FormBuilderProps> = ({ isOpen, onClose, onSave, initialForm }) => {
  const [form, setForm] = useState<Form>(
    initialForm || {
      id: `form-${Date.now()}`,
      title: 'New Form',
      description: '',
      fields: [],
      submitUrl: '',
      submitButtonText: 'Submit'
    }
  );

  const fieldTypes = [
    { type: 'text', label: 'Text Input', icon: '📝' },
    { type: 'email', label: 'Email', icon: '📧' },
    { type: 'textarea', label: 'Text Area', icon: '📄' },
    { type: 'select', label: 'Dropdown', icon: '📋' },
    { type: 'checkbox', label: 'Checkbox', icon: '☑️' },
    { type: 'radio', label: 'Radio Buttons', icon: '🔘' },
    { type: 'number', label: 'Number', icon: '🔢' },
    { type: 'date', label: 'Date', icon: '📅' },
  ];

  const addField = (type: FormField['type']) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      placeholder: '',
      required: false,
      options: type === 'select' || type === 'checkbox' || type === 'radio' ? ['Option 1', 'Option 2'] : undefined,
    };

    setForm(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };

  const removeField = (fieldId: string) => {
    setForm(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
  };

  const moveField = (fromIndex: number, toIndex: number) => {
    setForm(prev => {
      const newFields = [...prev.fields];
      const [movedField] = newFields.splice(fromIndex, 1);
      newFields.splice(toIndex, 0, movedField);
      return { ...prev, fields: newFields };
    });
  };

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Form Builder
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex h-[calc(90vh-120px)]">
            {/* Left Panel - Form Settings */}
            <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 p-6 overflow-y-auto">
              <div className="space-y-6">
                {/* Form Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Form Settings
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Form Title
                      </label>
                      <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={form.description}
                        onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Submit URL (Google Apps Script)
                      </label>
                      <input
                        type="url"
                        value={form.submitUrl}
                        onChange={(e) => setForm(prev => ({ ...prev, submitUrl: e.target.value }))}
                        placeholder="https://script.google.com/macros/s/..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Submit Button Text
                      </label>
                      <input
                        type="text"
                        value={form.submitButtonText}
                        onChange={(e) => setForm(prev => ({ ...prev, submitButtonText: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Field Types */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Add Fields
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {fieldTypes.map((fieldType) => (
                      <motion.button
                        key={fieldType.type}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => addField(fieldType.type as FormField['type'])}
                        className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                      >
                        <div className="text-2xl mb-1">{fieldType.icon}</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {fieldType.label}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Form Preview */}
            <div className="w-2/3 p-6 overflow-y-auto">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Form Preview
                </h3>
                
                {/* Form Preview */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {form.title}
                  </h2>
                  {form.description && (
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {form.description}
                    </p>
                  )}
                  
                  <div className="space-y-4">
                    {form.fields.map((field, index) => (
                      <div key={field.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center gap-2 mb-3">
                          <GripVertical className="text-gray-400 cursor-move" size={16} />
                          <span className="text-sm text-gray-500">{fieldTypes.find(ft => ft.type === field.type)?.icon}</span>
                          <input
                            type="text"
                            value={field.label}
                            onChange={(e) => updateField(field.id, { label: e.target.value })}
                            className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                          <button
                            onClick={() => removeField(field.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        
                        {/* Field Preview */}
                        <div className="ml-6">
                          {field.type === 'text' && (
                            <input
                              type="text"
                              placeholder={field.placeholder || field.label}
                              disabled
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500"
                            />
                          )}
                          {field.type === 'email' && (
                            <input
                              type="email"
                              placeholder={field.placeholder || field.label}
                              disabled
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500"
                            />
                          )}
                          {field.type === 'textarea' && (
                            <textarea
                              placeholder={field.placeholder || field.label}
                              disabled
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500"
                            />
                          )}
                          {field.type === 'select' && (
                            <select disabled className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500">
                              <option>{field.label}</option>
                              {field.options?.map((option, i) => (
                                <option key={i}>{option}</option>
                              ))}
                            </select>
                          )}
                          {field.type === 'checkbox' && (
                            <div className="space-y-2">
                              {field.options?.map((option, i) => (
                                <label key={i} className="flex items-center gap-2 text-gray-500">
                                  <input type="checkbox" disabled />
                                  {option}
                                </label>
                              ))}
                            </div>
                          )}
                          {field.type === 'radio' && (
                            <div className="space-y-2">
                              {field.options?.map((option, i) => (
                                <label key={i} className="flex items-center gap-2 text-gray-500">
                                  <input type="radio" disabled />
                                  {option}
                                </label>
                              ))}
                            </div>
                          )}
                          {field.type === 'number' && (
                            <input
                              type="number"
                              placeholder={field.placeholder || field.label}
                              disabled
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500"
                            />
                          )}
                          {field.type === 'date' && (
                            <input
                              type="date"
                              disabled
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {form.fields.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No fields added yet. Use the left panel to add fields.</p>
                    </div>
                  )}
                  
                  {form.fields.length > 0 && (
                    <div className="mt-6">
                      <button
                        disabled
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg opacity-50 cursor-not-allowed"
                      >
                        {form.submitButtonText}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Form
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FormBuilder;