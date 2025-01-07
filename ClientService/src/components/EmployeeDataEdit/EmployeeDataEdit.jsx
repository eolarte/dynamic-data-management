import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dataModelService } from '../../services/api';
import './EmployeeDataEdit.css';

const EmployeeDataEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState(null);
  const [modelStructure, setModelStructure] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [effectiveDates, setEffectiveDates] = useState({});

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [employee, models] = await Promise.all([
        dataModelService.getEmployeeDataById(id),
        dataModelService.getDataModels()
      ]);
      
      setEmployeeData(employee);
      setModelStructure(models.find(m => m.id === employee.modelId));
    } catch (err) {
      setError('Failed to load employee data');
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (categoryId, field, value, effectiveDate) => {
    setEmployeeData(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [categoryId]: {
          ...prev.data[categoryId],
          [field.id]: {
            name: field.name,
            value: value,
            ...(effectiveDate ? { effectiveDate: effectiveDate } : {})
          }
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
      const cleanData = {};
      modelStructure.categories.forEach(category => {
        cleanData[category.id] = {};
        category.fields.forEach(field => {
          if (employeeData.data[category.id]?.[field.id]) {
            cleanData[category.id][field.id] = employeeData.data[category.id][field.id];
          }
        });
      });

      const updatedEmployeeData = {
        ...employeeData,
        data: cleanData
      };

      await dataModelService.updateEmployeeData(id, updatedEmployeeData);
      setSuccess(true);
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const FieldHistory = ({ history }) => {
    if (!history || history.length === 0) return null;

    return (
      <div className="field-history">
        <h4>History</h4>
        <ul>
          {history.map((entry, index) => (
            <li key={index}>
              <span className="history-value">{entry.value}</span>
              <span className="history-date">
                {new Date(entry.changedAt).toLocaleString()}
              </span>
              <span className="history-user">{entry.changedBy}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const handleEffectiveDateChange = (categoryId, fieldId, date) => {
    setEffectiveDates(prev => ({
      ...prev,
      [`${categoryId}.${fieldId}`]: date
    }));

    // Update the field value with the new effective date
    const fieldData = employeeData.data[categoryId]?.[fieldId];
    if (fieldData?.value) {
      handleInputChange(categoryId, { id: fieldId, name: fieldData.name }, fieldData.value, date);
    }
  };

  const renderField = (categoryId, field) => {
    const fieldData = employeeData.data[categoryId]?.[field.id];
    const value = fieldData?.value || '';
    const effectiveDate = effectiveDates[`${categoryId}.${field.id}`] || '';
    const history = fieldData?.history || [];
    const futureChanges = fieldData?.futureChanges || [];

    const handleValueChange = (newValue) => {
      handleInputChange(categoryId, field, newValue, effectiveDate);
    };

    return (
      <div className="field-container">
        <div className="field-input-group">
          {/* Value input */}
          <div className="value-input">
            {field.type === 'select' ? (
              <select
                value={value}
                onChange={(e) => handleValueChange(e.target.value)}
                required={field.required === 'true'}
              >
                <option value="">Select {field.label}</option>
                {field.options?.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type || 'text'}
                value={value}
                onChange={(e) => handleValueChange(e.target.value)}
                required={field.required === 'true'}
              />
            )}
          </div>

          {/* Effective date input with label */}
          <div className="effective-date-container">
            <label className="effective-date-label">Effective Date</label>
            <input
              type="date"
              value={effectiveDate}
              onChange={(e) => handleEffectiveDateChange(categoryId, field.id, e.target.value)}
              className="effective-date-input"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        {/* Future changes section */}
        {futureChanges.length > 0 && (
          <div className="future-changes">
            <h5>Scheduled Changes</h5>
            <ul>
              {futureChanges.map((change, index) => (
                <li key={index}>
                  <span className="future-value">{change.value}</span>
                  <span className="future-date">
                    Effective: {new Date(change.effectiveDate).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* History section */}
        <FieldHistory history={history} />
      </div>
    );
  };

  if (loading) return <div className="loading-message">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!employeeData || !modelStructure) return <div>No data found</div>;

  return (
    <div className="employee-data-edit">
      <h2>Edit Employee Data</h2>
      {success && <div className="success-message">Successfully updated!</div>}

      <form onSubmit={handleSubmit}>
        {modelStructure.categories.map((category) => (
          <div key={category.id} className="edit-category">
            <h3>{category.name}</h3>
            <div className="category-fields">
              {category.fields.map((field) => (
                <div key={field.id} className="edit-field">
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
          <button type="button" onClick={() => navigate('/')} className="cancel-button">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="save-button">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeDataEdit; 