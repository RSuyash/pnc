# PNC Dashboard Tools - Comprehensive Data Management System

## Overview

This system provides advanced dashboard tools for managing Prithvi Nature Club data stored in Notion. The tools are designed to make data access, management, and visualization easy for different user types, especially admins.

## Features

### 1. Enhanced Notion Data Access (`notion_data_access.py`)
- Advanced search with multiple filters and sorting
- Department-based member retrieval
- Status-based member retrieval
- Year-based member retrieval
- Executive committee filtering
- Active member identification
- Name-based searching
- Member statistics and analytics
- Task tracking for members
- JSON export functionality

### 2. Dashboard Visualization (`dashboard_visualizer.py`)
- Department distribution charts
- Status distribution charts
- Year distribution charts
- Comprehensive statistics reports
- Admin dashboard data generation
- Department performance reports
- Data export capabilities

### 3. Bulk Operations (`bulk_operations.py`)
- Bulk member updates by filter
- CSV import functionality
- CSV export with optional filtering
- Bulk deletion (status update to "Deleted")
- Duplicate detection
- Year update for all members based on status

### 4. Interactive Dashboard (`main_dashboard.py`)
- All-in-one interface combining all tools
- Menu-driven navigation
- Real-time data access
- Comprehensive admin controls

## User Type Dashboards

### For Admins (Maximum Access):
1. **Real-time Member Overview** - View all members with filters by year, status, department
2. **Quick Status Updates** - Bulk update member statuses or years
3. **User Management Panel** - Add, edit, or remove users from the database
4. **Activity Dashboard** - Track member activity, project assignments, and task completion
5. **Financial Tracking** - Track amounts owed by club, reimbursements, and financial transactions
6. **Department Head Management** - Assign and track department heads and their responsibilities
7. **Data Synchronization** - Sync data between Notion and TypeScript files automatically
8. **Bulk Import/Export** - Tools to import/export data from CSV files
9. **Duplicate Detection** - Find potential duplicate members
10. **Visual Analytics** - Charts and graphs for data insights

### For Department Heads:
1. **Team Management** - View and manage members in their department
2. **Project Tracking** - Track active projects in their department
3. **Task Assignment** - View members with assigned tasks
4. **Department Performance Metrics** - Visual charts showing department progress

### For Regular Members:
1. **Personal Dashboard** - View personal information, assigned tasks, and projects
2. **Team View** - View members of their department/teams
3. **Project Participation** - Track projects they're involved in
4. **Resource Access** - Access links to relevant resources and documents

## Installation & Setup

1. Ensure you have the PNC backend installed and configured with your Notion token
2. Place these dashboard tools in the `dashboard-tools/` directory
3. Make sure you have the required dependencies from the backend

## Usage

### 1. Run the Interactive Dashboard
```
python main_dashboard.py
```

### 2. Use Individual Tools
```
# For data access
python notion_data_access.py

# For visualizations
python dashboard_visualizer.py

# For bulk operations
python bulk_operations.py
```

### 3. Programmatic Usage
```python
from dashboard_tools.notion_data_access import EnhancedNotionDataAccess

async def my_function():
    access = EnhancedNotionDataAccess()
    result = await access.get_active_members()
    print(f"Active members: {result['count']}")
```

## Key Capabilities

### Advanced Search and Filtering
- Search by name, department, status, year
- Filter with complex query structures
- Sort results by various criteria

### Data Management
- Bulk import from CSV files
- Bulk export to CSV files
- Mass updates based on filters
- Duplicate detection and management

### Analytics and Reporting
- Comprehensive statistics reports
- Visual charts for data distribution
- Department performance insights
- Engagement metrics

### Administration
- User status management
- Year assignment based on activity
- Task tracking across the organization
- Financial data handling

## Security and Access Control

The system integrates with the existing PNC authentication system:
- Admins have full access to all operations
- Department heads can access their department data
- Regular members have limited read-only access
- Guest users have minimal access

## Benefits

1. **Centralized Data Access**: Single interface for all Notion data operations
2. **Efficient Bulk Operations**: Handle multiple records simultaneously
3. **Visual Analytics**: Understand data through charts and reports
4. **Time Savings**: Simplified workflows for common tasks
5. **Data Integrity**: Built-in validation and error handling
6. **Role-Based Access**: Appropriate permissions for different user types
7. **Export Flexibility**: Multiple formats for data sharing

## Integration with Existing System

The dashboard tools seamlessly integrate with the existing:
- Notion database system
- Authentication and authorization
- Frontend application
- Data management APIs
- TypeScript member data files

This comprehensive dashboard system provides powerful tools for managing PNC's data efficiently while ensuring appropriate access for different user types, especially admins who need the most extensive capabilities.