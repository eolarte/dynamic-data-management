# Dynamic Data Management System

A flexible system for managing dynamic data models and employee records with customizable fields, categories, and support for future-dated changes.

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
  "_id": {
    "$oid": "677bf7845862e8b7872079cb"
  },
  "name": "Master model",
  "description": "M12",
  "categories": [
    {
      "id": "e4957d61-cb3f-4069-b31a-82a57ba2c6d2",
      "name": "Employee Data",
      "fields": [
        {
          "id": "b1e65140-bcae-44d2-8e00-b4c4e57890e3",
          "name": "name",
          "label": "Name",
          "type": "text",
          "required": "true",
          "options": []
        },
        {
          "id": "73f6ca57-22a8-4574-b037-5b075009ab56",
          "name": "surname",
          "label": "Surname",
          "type": "text",
          "required": "true",
          "options": []
        }
      ]
    },
    {
      "id": "6cf04f61-a8ce-49c8-b5ae-eddd0e8516e8",
      "name": "Employment Data",
      "fields": [
        {
          "id": "714e1dca-d822-4e85-aae3-62eb5b6d162e",
          "name": "salary_base",
          "label": "Salary Base",
          "type": "number",
          "required": "true",
          "options": []
        },
        {
          "id": "5b29cc81-e386-4a63-a268-8391b42afc5c",
          "name": "starting_date",
          "label": "Starting Date",
          "type": "date",
          "required": "false",
          "options": []
        },
        {
          "id": "daa62ebe-f3ce-49eb-8a03-c6bc4ac06c32",
          "name": "comments",
          "label": "Comments",
          "type": "text",
          "required": "false",
          "options": []
        }
      ]
    }
  ],
  "createdAt": {
    "$date": "2025-01-07T12:54:17.451Z"
  },
  "collectionName": "datamodels"
}
```

### Employee Data
```json
{
  "_id": {
    "$oid": "677d2254ac28a989a0d559ea"
  },
  "modelId": "677bf7845862e8b7872079cb",
  "modelName": "Master model",
  "data": {
    "e4957d61-cb3f-4069-b31a-82a57ba2c6d2": {
      "b1e65140-bcae-44d2-8e00-b4c4e57890e3": {
        "name": "name",
        "value": "Eduin",
        "history": [],
        "futureChanges": []
      },
      "73f6ca57-22a8-4574-b037-5b075009ab56": {
        "name": "surname",
        "value": "Olarte R",
        "history": [
          {
            "value": "Olarte",
            "changedAt": {
              "$date": "2025-01-07T12:51:30.664Z"
            },
            "changedBy": "system"
          }
        ],
        "futureChanges": [
          {
            "value": "Olarte Rodriguez",
            "effectiveDate": {
              "$date": "2025-01-07T23:00:00.000Z"
            },
            "createdAt": {
              "$date": "2025-01-07T12:51:53.520Z"
            },
            "createdBy": "system"
          }
        ]
      }
    },
    "6cf04f61-a8ce-49c8-b5ae-eddd0e8516e8": {
      "714e1dca-d822-4e85-aae3-62eb5b6d162e": {
        "name": "salary_base",
        "value": "56346",
        "history": [],
        "futureChanges": []
      },
      "5b29cc81-e386-4a63-a268-8391b42afc5c": {
        "name": "starting_date",
        "value": "2025-01-01",
        "history": [],
        "futureChanges": []
      }
    }
  },
  "createdAt": {
    "$date": "2025-01-07T12:47:16.874Z"
  },
  "updatedAt": {
    "$date": "2025-01-07T12:51:53.522Z"
  }
}
```

## Features

### Data Model Management
- Create custom data models with dynamic fields
- Organize fields into categories
- Support for multiple field types:
  - Text
  - Number
  - Date
  - Select (Dropdown)
- Field validation with required fields
- Edit existing data models

### Employee Data Management
- Create employee records based on data models
- Data organized by categories
- Field validation based on model requirements
- Edit existing employee records
- List view with filtering by model type
- Value change history tracking
- Future-dated value changes
- Scheduled changes management

### Change Management Features
- **Immediate Changes**
  - Direct value updates
  - Automatic history tracking
  - Change attribution

- **Future-Dated Changes**
  - Schedule value changes for future dates
  - Multiple pending changes per field
  - Automatic application on effective date
  - Change history preservation
  - Visual timeline of scheduled changes

- **Change History**
  - Complete audit trail of changes
  - Timestamp tracking
  - User attribution
  - Historical value preservation

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
- Ensure proper date handling across timezones
- Validate future dates are not in the past

## New Environment Variables
```env
FUTURE_CHANGES_INTERVAL=300000  # Interval for checking future changes (in ms)
```