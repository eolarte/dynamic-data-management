import React, { useState, useEffect } from 'react';
import './DataModelEditor.css';
import { dataModelService } from '../../services/api';

const DataModelEditor = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      const response = await dataModelService.getDataModels();
      setModels(response);
    } catch (err) {
      console.error('Load models error:', err);
    }
  };

  const handleModelSelect = (modelId) => {
    const model = models.find(m => m.id === modelId);
    if (model) {
      // Ensure each category and field has an ID
      const modelWithIds = {
        ...model,
        categories: model.categories.map(category => ({
          ...category,
          id: category.id || crypto.randomUUID(),
          fields: category.fields.map(field => ({
            ...field,
            id: field.id || crypto.randomUUID()
          }))
        }))
      };
      setSelectedModel(modelWithIds);
    }
  };

  const addCategory = () => {
    if (!selectedModel) return;
    
    setSelectedModel(prev => ({
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
    setSelectedModel(prev => ({
      ...prev,
      categories: prev.categories.map(cat => 
        cat.id === categoryId ? { ...cat, name: newName } : cat
      )
    }));
  };

  const addField = (categoryId) => {
    setSelectedModel(prev => ({
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
    setSelectedModel(prev => ({
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

  const addOption = (categoryId, fieldId) => {
    setSelectedModel(prev => ({
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

  const updateFieldOptions = (categoryId, fieldId, optionIndex, optionData) => {
    setSelectedModel(prev => ({
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      await dataModelService.updateDataModel(selectedModel.id, selectedModel);
      setSuccess(true);
      loadModels(); // Refresh the list
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="data-model-editor">
      <h2>Edit Data Model</h2>
      
      <select
        value={selectedModel?.id || ''}
        onChange={(e) => handleModelSelect(e.target.value)}
      >
        <option value="">Select a model to edit</option>
        {models.map(model => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>

      {selectedModel && (
        <form onSubmit={handleSubmit}>
          <div className="model-basics">
            <input
              type="text"
              placeholder="Model Name"
              value={selectedModel.name}
              onChange={(e) => setSelectedModel({ ...selectedModel, name: e.target.value })}
            />
            <textarea
              placeholder="Model Description"
              value={selectedModel.description}
              onChange={(e) => setSelectedModel({ ...selectedModel, description: e.target.value })}
            />
          </div>

          <div className="categories-section">
            <div className="categories-header">
              <h3>Categories</h3>
              <button type="button" onClick={addCategory} className="add-button">
                Add Category
              </button>
            </div>

            {selectedModel.categories.map((category) => (
              <div key={category.id} className="category">
                <div className="category-header">
                  <input
                    type="text"
                    value={category.name}
                    onChange={(e) => updateCategoryName(category.id, e.target.value)}
                    placeholder="Category Name"
                  />
                  <button
                    type="button"
                    onClick={() => addField(category.id)}
                    className="add-button"
                  >
                    Add Field
                  </button>
                </div>

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
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default DataModelEditor; 