import React, { useState, useEffect } from 'react';
import { dataModelService } from '../../services/api';
import './EmployeeDataForm.css';

const EmployeeDataForm = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      setLoading(true);
      const response = await dataModelService.getDataModels();
      setModels(response);
    } catch (err) {
      setError('Failed to load data models');
    } finally {
      setLoading(false);
    }
  };

  const handleModelSelect = (modelId) => {
    const model = models.find(m => m.id === modelId);
    setSelectedModel(model);
    // Initialize form data with empty values
    const initialData = {};
    model.categories.forEach(category => {
      category.fields.forEach(field => {
        initialData[field.name] = '';
      });
    });
    setFormData(initialData);
  };

  const handleInputChange = (categoryId, field, value) => {
    setFormData(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [field.id]: {
          name: field.name,
          value: value
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      // Create a clean version of the form data without extra properties
      const cleanFormData = {};
      selectedModel.categories.forEach(category => {
        cleanFormData[category.id] = {};
        category.fields.forEach(field => {
          if (formData[category.id]?.[field.id]) {
            cleanFormData[category.id][field.id] = formData[category.id][field.id];
          }
        });
      });

      const employeeData = {
        modelId: selectedModel.id,
        modelName: selectedModel.name,
        data: cleanFormData
      };

      await dataModelService.saveEmployeeData(employeeData);
      setSuccess(true);
      setFormData({});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (categoryId, field) => {
    const value = formData[categoryId]?.[field.id]?.value || '';

    switch (field.type) {
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(categoryId, field, e.target.value)}
            required={field.required === 'true'}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleInputChange(categoryId, field, e.target.value)}
            required={field.required === 'true'}
          />
        );
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(categoryId, field, e.target.value)}
            required={field.required === 'true'}
          />
        );
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(categoryId, field, e.target.value)}
            required={field.required === 'true'}
          />
        );
    }
  };

  return (
    <div className="employee-data-form">
      <h2>Enter Employee Data</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Employee data saved successfully!</div>}

      <div className="model-selector">
        <select
          onChange={(e) => handleModelSelect(e.target.value)}
          disabled={loading}
          value={selectedModel?.id || ''}
        >
          <option value="">Select a data model</option>
          {models.map(model => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>

      {selectedModel && (
        <form onSubmit={handleSubmit}>
          {selectedModel.categories.map((category) => (
            <div key={category.id} className="category-section">
              <h3>{category.name}</h3>
              <div className="fields-grid">
                {category.fields.map((field) => (
                  <div key={field.id} className="field">
                    <label>
                      {field.label}
                      {field.required === 'true' && <span className="required">*</span>}
                    </label>
                    {renderField(category.id, field)}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="form-actions">
            <button
              type="submit"
              disabled={loading}
              className={loading ? 'loading' : ''}
            >
              {loading ? 'Saving...' : 'Save Employee Data'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EmployeeDataForm; 