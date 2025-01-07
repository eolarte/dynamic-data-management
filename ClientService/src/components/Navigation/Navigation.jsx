import React from 'react';
import './Navigation.css';

const Navigation = ({ activeModule, onModuleChange }) => {
  return (
    <nav className="main-navigation">
      <ul>
        <li>
          <button 
            className={activeModule === 'builder' ? 'active' : ''}
            onClick={() => onModuleChange('builder')}
          >
            Create Model
          </button>
        </li>
        <li>
          <button 
            className={activeModule === 'editor' ? 'active' : ''}
            onClick={() => onModuleChange('editor')}
          >
            Edit Models
          </button>
        </li>
        <li>
          <button 
            className={activeModule === 'employee' ? 'active' : ''}
            onClick={() => onModuleChange('employee')}
          >
            Employee Data
          </button>
        </li>
        <li>
          <button 
            className={activeModule === 'employeeList' ? 'active' : ''}
            onClick={() => onModuleChange('employeeList')}
          >
            View Employee Data
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation; 