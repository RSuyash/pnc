# PNC Dashboard API Documentation

## Overview

The PNC Dashboard API provides endpoints for managing and retrieving member data from Notion databases. These endpoints are designed for use by the frontend dashboard, particularly for administrative functions.

## Authentication

All endpoints require authentication using a JWT token in the Authorization header:
```
Authorization: Bearer {your-jwt-token}
```

Admin access is required for most endpoints.

## Endpoints

### GET /api/dashboard/summary

**Description:** Get comprehensive dashboard summary for admins including member counts, engagement metrics, etc.

**Authentication:** Admin role required

**Parameters:** None

**Response:**
```json
{
  "success": true,
  "summary": {
    "total_members": 120,
    "active_members": 95,
    "members_with_tasks": 42,
    "active_percentage": 79.17,
    "engagement_rate": 44.21,
    "timestamp": "2025-10-25T16:30:00.123456"
  }
}
```

### GET /api/dashboard/members/search

**Description:** Search members by name or other fields

**Authentication:** Admin role required

**Parameters:**
- `query` (string, required): Search query for member names

**Response:**
```json
{
  "success": true,
  "members": [
    {
      "id": "member-notion-id",
      "properties": {
        "Name": "John Doe",
        "Role": "Member",
        "Department": "Research",
        "Status": "Active"
      }
    }
  ],
  "count": 1
}
```

### GET /api/dashboard/members/stats

**Description:** Get comprehensive member statistics

**Authentication:** Admin role required

**Parameters:** None

**Response:**
```json
{
  "success": true,
  "statistics": {
    "total_members": 120,
    "departments": {
      "Research": 25,
      "Media": 18,
      "Executive": 12
    },
    "statuses": {
      "Active": 95,
      "Inactive": 25
    },
    "years": {
      "25-26": 80,
      "24-25": 40
    },
    "roles": {
      "Member": 80,
      "Head": 15,
      "President": 1
    }
  }
}
```

### GET /api/dashboard/members/filter

**Description:** Filter members by department, status, or year

**Authentication:** Admin role required

**Parameters (query):**
- `department` (string, optional): Filter by department
- `status` (string, optional): Filter by status (Active, Inactive)
- `year` (string, optional): Filter by year (24-25, 25-26)

**Response:**
```json
{
  "success": true,
  "members": [...],
  "count": 25
}
```

### GET /api/dashboard/members/departments

**Description:** Get all unique departments

**Authentication:** Admin role required

**Parameters:** None

**Response:**
```json
{
  "success": true,
  "departments": ["Research", "Media", "Executive", "Operations"]
}
```

### POST /api/dashboard/members/bulk-update

**Description:** Bulk update members based on filters

**Authentication:** Admin role required

**Request Body:**
```json
{
  "filter": {
    "Status": "Active"
  },
  "updates": {
    "Year": "25-26"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Updated 95 members",
  "updated_count": 95,
  "failed_count": 0,
  "failed_updates": []
}
```

## Frontend Usage

### Using the TypeScript Service

```typescript
import DashboardAPIClient from '@/services/dashboardAPI';

const apiClient = new DashboardAPIClient();

// Get dashboard summary
const summary = await apiClient.getDashboardSummary();

// Search members
const searchResults = await apiClient.searchMembers('John');

// Filter members
const filtered = await apiClient.filterMembers({ department: 'Research' });

// Get statistics
const stats = await apiClient.getMemberStatistics();
```

### Using React Hooks

```typescript
import { useDashboardAPI, useDashboardData } from '@/hooks/useDashboardAPI';

// Using the API hooks
const { getSummary, searchMembers } = useDashboardAPI();

// Using hooks with loading states
const { loading, error, loadDashboardSummary } = useDashboardData();
```

## Error Handling

In case of errors, endpoints return:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Permissions

- Admin: Full access to all endpoints
- Moderator: Limited access (specific permissions defined in backend)
- Member: Read-only access to own data
- Guest: No access to dashboard endpoints