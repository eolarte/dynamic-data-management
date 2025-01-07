import React, { useState } from 'react';
import './App.css';
import DataModelBuilder from './components/DataModelBuilder/DataModelBuilder';
import DataModelEditor from './components/DataModelEditor/DataModelEditor';
import EmployeeDataForm from './components/EmployeeDataForm/EmployeeDataForm';
import EmployeeDataList from './components/EmployeeDataList/EmployeeDataList';
import Navigation from './components/Navigation/Navigation';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EmployeeDataEdit from './components/EmployeeDataEdit/EmployeeDataEdit';

function App() {
  const [activeModule, setActiveModule] = useState('builder');

  return (
    <Router>
      <div className="App">
        <Navigation onModuleChange={setActiveModule} activeModule={activeModule} />
        <Routes>
          <Route path="/employee/edit/:id" element={<EmployeeDataEdit />} />
          <Route path="/" element={
            <main>
              {activeModule === 'builder' ? (
                <DataModelBuilder />
              ) : activeModule === 'editor' ? (
                <DataModelEditor />
              ) : activeModule === 'employee' ? (
                <EmployeeDataForm />
              ) : (
                <EmployeeDataList />
              )}
            </main>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 