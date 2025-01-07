import React, { useState, useEffect } from 'react';
import { dataModelService } from '../../services/api';
import './EmployeeDataList.css';
import { useNavigate } from 'react-router-dom';

const EmployeeDataList = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedModelId, setSelectedModelId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadModels();
    loadEmployeeData();
  }, []);

  const loadModels = async () => {
    try {
      const response = await dataModelService.getDataModels();
      setModels(response);
    } catch (err) {
      console.error('Load models error:', err);
    }
  };

  const loadEmployeeData = async () => {
    try {
      setLoading(true);
      const response = await dataModelService.getEmployeeData();
      setEmployeeData(response);
    } catch (err) {
      setError('Failed to load employee data');
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getModelStructure = (modelId) => {
    return models.find(m => m.id === modelId);
  };

  const renderFieldsByCategory = (data, modelStructure) => {
    if (!modelStructure) return null;

    return modelStructure.categories.map((category) => {
      if (!data[category.id]) return null;

      return (
        <div key={category.id} className="data-category">
          <h4 className="category-title">{category.name}</h4>
          <div className="category-fields">
            {category.fields.map((field) => {
              const fieldData = data[category.id]?.[field.id];
              if (!fieldData) return null;

              return (
                <div key={field.id} className="data-field">
                  <span className="field-label">{field.label}:</span>
                  <span className="field-value">
                    {fieldData.value || '-'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }).filter(Boolean);
  };

  const filteredData = selectedModelId
    ? employeeData.filter(item => item.modelId === selectedModelId)
    : employeeData;

  return (
    <div className="employee-data-list">
      <h2>Employee Data List</h2>

      <div className="filters">
        <select
          value={selectedModelId}
          onChange={(e) => setSelectedModelId(e.target.value)}
          className="model-filter"
        >
          <option value="">All Data Models</option>
          {models.map(model => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-message">Loading...</div>}

      <div className="data-grid">
        {filteredData.map((item) => {
          const modelStructure = getModelStructure(item.modelId);
          return (
            <div key={item.id} className="data-card">
              <div className="card-header">
                <h3>{item.modelName}</h3>
                <div className="card-actions">
                  <button
                    onClick={() => navigate(`/employee/edit/${item.id}`)}
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <span className="date">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="card-content">
                {renderFieldsByCategory(item.data, modelStructure)}
              </div>
            </div>
          );
        })}
      </div>

      {filteredData.length === 0 && !loading && (
        <div className="no-data">
          {selectedModelId 
            ? 'No employee data found for this model'
            : 'No employee data found'}
        </div>
      )}
    </div>
  );
};

export default EmployeeDataList; 