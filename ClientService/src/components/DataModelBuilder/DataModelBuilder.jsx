import React, { useState } from 'react';
import './DataModelBuilder.css';
import { dataModelService } from '../../services/api';

const DataModelBuilder = () => {
  const [model, setModel] = useState({
    name: '',
    description: '',
    categories: []
  });
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const addCategory = () => {
    setModel(prev => ({
      ...prev,
      categories: [
        ...prev.categories,
        {
          id: crypto.randomUUID(),
          name: 'New Category',
          fields: []
        }
      ]
    }));
  };

  const updateCategoryName = (categoryId, newName) => {
    setModel(prev => ({
      ...prev,
      categories: prev.categories.map(cat => 
        cat.id === categoryId ? { ...cat, name: newName } : cat
      )
    }));
  };

  const addField = (categoryId) => {
    setModel(prev => ({
      ...prev,
      categories: prev.categories.map(cat => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            fields: [
              ...cat.fields,
              {
                id: crypto.randomUUID(),
                name: '',
                label: '',
                type: 'text',
                required: 'false',
                options: []
              }
            ]
          };
        }
        return cat;
      })
    }));
  };

  const updateField = (categoryId, fieldId, fieldData) => {
    setModel(prev => ({
      ...prev,
      categories: prev.categories.map(cat => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            fields: cat.fields.map(field => 
              field.id === fieldId ? { ...field, ...fieldData } : field
            )
          };
        }
        return cat;
      })
    }));
  };

  const updateFieldOptions = (categoryId, fieldId, optionIndex, optionData) => {
    setModel(prev => ({
      ...prev,
      categories: prev.categories.map(cat => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            fields: cat.fields.map(field => {
              if (field.id === fieldId) {
                const updatedOptions = [...(field.options || [])];
                updatedOptions[optionIndex] = {
                  ...updatedOptions[optionIndex],
                  ...optionData
                };
                return { ...field, options: updatedOptions };
              }
              return field;
            })
          };
        }
        return cat;
      })
    }));
  };

  const addOption = (categoryId, fieldId) => {
    setModel(prev => ({
      ...prev,
      categories: prev.categories.map(cat => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            fields: cat.fields.map(field => {
              if (field.id === fieldId) {
                return {
                  ...field,
                  options: [...(field.options || []), { label: '', value: '' }]
                };
              }
              return field;
            })
          };
        }
        return cat;
      })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      // Validate the model before submission
      if (!model.name.trim()) {
        throw new Error('Model name is required');
      }

      if (model.categories.length === 0) {
        throw new Error('At least one category is required');
      }

      // Validate that all categories have at least one field
      const invalidCategory = model.categories.find(cat => cat.fields.length === 0);
      if (invalidCategory) {
        throw new Error(`Category "${invalidCategory.name}" must have at least one field`);
      }

      // Validate that all fields have names and labels
      model.categories.forEach(category => {
        category.fields.forEach(field => {
          if (!field.name.trim() || !field.label.trim()) {
            throw new Error('All fields must have both name and label');
          }
        });
      });

      console.log('Sending model:', model); // Debug log
      const result = await dataModelService.saveDataModel(model);
      console.log('Save result:', result); // Debug log
      setSuccess(true);
      setModel({
        name: '',
        description: '',
        categories: []
      });
    } catch (err) {
      console.error('Submit error:', err); // Debug log
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="data-model-builder">
      <h2>Create Data Model</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {success && (
        <div className="success-message">
          Data model saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="model-basics">
          <input
            type="text"
            placeholder="Model Name"
            value={model.name}
            onChange={(e) => setModel({ ...model, name: e.target.value })}
          />
          <textarea
            placeholder="Model Description"
            value={model.description}
            onChange={(e) => setModel({ ...model, description: e.target.value })}
          />
        </div>

        <div className="categories-section">
          <h3>Categories</h3>
          <button type="button" onClick={addCategory}>
            Add Category
          </button>

          {model.categories.map((category) => (
            <div key={category.id} className="category">
              <input
                type="text"
                value={category.name}
                onChange={(e) => updateCategoryName(category.id, e.target.value)}
                placeholder="Category Name"
              />
              <button
                type="button"
                onClick={() => addField(category.id)}
              >
                Add Field
              </button>

              {category.fields.map((field) => (
                <div key={field.id} className="field">
                  <input
                    type="text"
                    placeholder="Field Name"
                    value={field.name}
                    onChange={(e) => updateField(category.id, field.id, { name: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Field Label"
                    value={field.label}
                    onChange={(e) => updateField(category.id, field.id, { label: e.target.value })}
                  />
                  <select
                    value={field.type}
                    onChange={(e) => updateField(category.id, field.id, { type: e.target.value })}
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                    <option value="email">Email</option>
                    <option value="select">Dropdown Select</option>
                  </select>
                  <select
                    value={field.required}
                    onChange={(e) => updateField(
                      category.id,
                      field.id,
                      { required: e.target.value }
                    )}
                  >
                    <option value="false">Not Required</option>
                    <option value="true">Required</option>
                  </select>

                  {field.type === 'select' && (
                    <div className="field-options">
                      <button
                        type="button"
                        onClick={() => addOption(category.id, field.id)}
                      >
                        Add Option
                      </button>
                      {field.options?.map((option, optionIndex) => (
                        <div key={optionIndex} className="option-row">
                          <input
                            type="text"
                            placeholder="Option Label"
                            value={option.label}
                            onChange={(e) => updateFieldOptions(
                              category.id,
                              field.id,
                              optionIndex,
                              { label: e.target.value }
                            )}
                          />
                          <input
                            type="text"
                            placeholder="Option Value"
                            value={option.value}
                            onChange={(e) => updateFieldOptions(
                              category.id,
                              field.id,
                              optionIndex,
                              { value: e.target.value }
                            )}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            disabled={loading}
            className={loading ? 'loading' : ''}
          >
            {loading ? 'Saving...' : 'Save Data Model'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DataModelBuilder;