# Dynamic Data Management System

A flexible system for managing dynamic data models and employee records with customizable fields and categories.

## Project Structure

### Backend (CoreService)

#### Models
- **DynamicDocument.cs**: Defines the structure for data models
  - Stores model metadata and field definitions
  - Supports categories and field configurations

- **EmployeeData.cs**: Represents employee records
  - Links to data models
  - Stores dynamic field values
  - Maintains creation timestamps

- **DTOs/**
  - `DynamicDocumentDto.cs`: Data transfer object for data models
  - `EmployeeDataDto.cs`: Data transfer object for employee records

#### Services
- **MongoDbService.cs**: Handles database operations
  - CRUD operations for data models
  - CRUD operations for employee records
  - MongoDB integration

#### Controllers
- **DynamicDataController.cs**: API endpoints
  ```csharp
  // Data Model endpoints
  GET    /api/dynamicdata/datamodels
  POST   /api/dynamicdata/datamodels
  PUT    /api/dynamicdata/datamodels/{id}
  
  // Employee Data endpoints
  GET    /api/dynamicdata/employeedata
  GET    /api/dynamicdata/employeedata/{id}
  POST   /api/dynamicdata/employeedata
  PUT    /api/dynamicdata/employeedata/{id}
  ```

### Frontend (ClientService)

#### Components
- **DataModelBuilder/**
  - Creates and edits data models
  - Manages categories and fields
  - Supports field validation rules

- **EmployeeDataForm/**
  - Creates new employee records
  - Dynamic form generation based on model
  - Field validation and data submission

- **EmployeeDataList/**
  - Displays employee records
  - Filters by data model
  - Edit and view capabilities

- **EmployeeDataEdit/**
  - Edits existing employee records
  - Pre-populates form with existing data
  - Maintains data structure integrity

#### Services
- **api.js**: API integration
  - Handles all backend communication
  - Error handling and data transformation

#### Models
- **DataModel.js**: Frontend data structures
  - Type definitions
  - Data validation

## Data Structures

### Data Model
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "categories": [
    {
      "id": "string",
      "name": "string",
      "fields": [
        {
          "id": "string",
          "name": "string",
          "label": "string",
          "type": "string",
          "required": "boolean",
          "options": [
            {
              "label": "string",
              "value": "string"
            }
          ]
        }
      ]
    }
  ]
}
```

### Employee Data
```json
{
  "id": "string",
  "modelId": "string",
  "modelName": "string",
  "data": {
    "categoryId": {
      "fieldId": {
        "name": "string",
        "value": "string"
      }
    }
  },
  "createdAt": "datetime"
}
```

## Features

### Data Model Management
- Create custom data models with categories
- Define fields with various types:
  - Text
  - Number
  - Date
  - Select (dropdown)
- Set field properties:
  - Required/Optional
  - Labels
  - Custom options for dropdowns
- Edit existing models

### Employee Data Management
- Create records based on data models
- Validate input against model rules
- Group data by categories
- Edit existing records
- List and filter records
- Maintain data integrity

## Technical Details

### Backend
- **.NET Core 6.0**
- **MongoDB** for data storage
- **RESTful API** architecture
- **DTO pattern** for data transfer
- **Dependency Injection**
- **Async/Await** operations

### Frontend
- **React**
- **JavaScript/ES6+**
- **Component-based** architecture
- **React Hooks** for state management
- **Dynamic form generation**
- **Responsive design**

## Setup Instructions

1. **Backend Setup**
   ```bash
   cd CoreService
   dotnet restore
   dotnet run
   ```

2. **Frontend Setup**
   ```bash
   cd ClientService
   npm install
   npm start
   ```

3. **MongoDB Setup**
   - Ensure MongoDB is running
   - Update connection string in `appsettings.json`

## Configuration

### Backend Configuration (appsettings.json)
```json
{
  "MongoDb": {
    "ConnectionString": "mongodb://localhost:27017",
    "DatabaseName": "dynamicdata"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

### Frontend Configuration
- API base URL configuration in `services/api.js`
- Environment-specific settings in `.env` files

## Dependencies
- .NET Core 6.0
- MongoDB.Driver
- React 17+
- Node.js 14+

## Development Guidelines
- Use meaningful component names
- Maintain consistent code formatting
- Follow REST API conventions
- Handle errors appropriately
- Document significant changes
- Test thoroughly before deployment