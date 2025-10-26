# Frontend Integration Guide for PNC Backend API

## Base URL
The backend API is available at: `http://localhost:8000`

## Available Endpoints

### Health Check
- `GET /api/health` - Check if the backend service is running

### Notion Integration Endpoints

#### Connection Testing
- `GET /api/test-connection` - Test connection to Notion API

#### Database Operations
- `GET /api/databases` - Get all accessible databases
- `GET /api/databases/{database_id}` - Get content from specific database
- `GET /api/databases/{database_id}/schema` - Get database schema
- `GET /api/pnc-databases` - Get databases relevant to PNC
- `GET /api/pnc-database-content/{database_id}` - Get PNC database content with pagination
- `GET /api/search-databases?name={query}` - Search databases by name

#### Page Operations
- `GET /api/pages` - Get all accessible pages
- `GET /api/pages/{page_id}` - Get content from specific page

#### All Content
- `GET /api/search-all` - Get all accessible content (both databases and pages)

## Integration with Your Existing Next.js Frontend

### Step 1: Update Environment Variables
Add the backend URL to your Next.js project's `.env.local` file in the `pnc-web` directory:

```env
BACKEND_API_URL=http://localhost:8000
NOTION_TOKEN=your_notion_integration_token_here
```

### Step 2: Update Your Existing Notion Integration
You can replace or enhance your existing Notion integration to use the Python backend instead of calling the Notion API directly from the frontend. This has security advantages as the token is stored on the backend.

Here's how to update your existing `NotionDataFetcher` component to use the Python backend:

```jsx
// src/components/notion/NotionDataFetcher.tsx
'use client';

import { useState, useEffect } from 'react';

interface NotionDatabase {
  id: string;
  title: string;
  content: Array<Record<string, any>>;
  schema: Record<string, any>;
}

interface NotionDataFetcherProps {
  databaseId?: string; // Optional: if you want to fetch specific database
}

const NotionDataFetcher: React.FC<NotionDataFetcherProps> = ({ databaseId }) => {
  const [data, setData] = useState<Array<Record<string, any>>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [databases, setDatabases] = useState<NotionDatabase[]>([]);
  const [selectedDb, setSelectedDb] = useState<string | null>(null);

  // Fetch all databases from the backend
  useEffect(() => {
    const fetchDatabases = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.BACKEND_API_URL}/api/pnc-databases`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
          setDatabases(result.databases);
          
          // If no specific database ID was provided, use the first one
          if (!databaseId && result.databases.length > 0) {
            setSelectedDb(result.databases[0].id);
            // Fetch content for the selected database
            const contentResponse = await fetch(`${process.env.BACKEND_API_URL}/api/databases/${result.databases[0].id}`);
            if (contentResponse.ok) {
              const contentResult = await contentResponse.json();
              if (contentResult.success) {
                setData(contentResult.content);
              }
            }
          } else if (databaseId) {
            // If a specific database ID was provided
            const targetDb = result.databases.find((db: any) => db.id === databaseId);
            if (targetDb) {
              setSelectedDb(databaseId);
              // Fetch specific database content
              const contentResponse = await fetch(`${process.env.BACKEND_API_URL}/api/databases/${databaseId}`);
              if (contentResponse.ok) {
                const contentResult = await contentResponse.json();
                if (contentResult.success) {
                  setData(contentResult.content);
                }
              }
            }
          }
        } else {
          throw new Error(result.message || 'Failed to fetch databases');
        }
      } catch (err) {
        console.error('Error fetching Notion data:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchDatabases();
  }, [databaseId]);

  // Fetch specific database when selectedDb changes
  useEffect(() => {
    if (selectedDb && !databaseId) { // Only run if databaseId wasn't provided as prop
      const fetchData = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const response = await fetch(`${process.env.BACKEND_API_URL}/api/databases/${selectedDb}`);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const result = await response.json();
          
          if (result.success) {
            setData(result.content);
          } else {
            throw new Error(result.message || 'Failed to fetch database content');
          }
        } catch (err) {
          console.error('Error fetching specific database:', err);
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [selectedDb, databaseId]);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading Notion data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-medium">Error loading Notion data</h3>
        <p className="text-red-600 text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="notion-data-container">
      {/* Database Selector - only show if no specific database was provided */}
      {!databaseId && databases.length > 1 && (
        <div className="mb-6">
          <label htmlFor="database-select" className="block text-sm font-medium text-gray-700 mb-2">
            Select Database:
          </label>
          <select
            id="database-select"
            value={selectedDb || ''}
            onChange={(e) => setSelectedDb(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
          >
            {databases.map((db) => (
              <option key={db.id} value={db.id}>
                {db.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Display database info if available */}
      {selectedDb && databases.length > 0 && (
        <div className="mb-6 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
          <h3 className="font-medium text-emerald-800">
            {databases.find(db => db.id === selectedDb)?.title || 'Selected Database'}
          </h3>
          <p className="text-sm text-emerald-600">
            {data.length} items • ID: {selectedDb}
          </p>
        </div>
      )}

      {/* Render the Notion data */}
      <div className="space-y-4">
        {data.length > 0 ? (
          data.map((item: any, index: number) => (
            <div 
              key={item.id || index} 
              className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              <h4 className="font-medium text-gray-900">
                {item.properties?.Name?.title?.[0]?.plain_text || 
                 item.properties?.Title?.title?.[0]?.plain_text || 
                 `Item ${index + 1}`}
              </h4>
              
              {/* Render other properties dynamically */}
              {Object.entries(item.properties || {}).map(([key, property]) => {
                if (key === 'Name' || key === 'Title') return null; // Skip the title as we already rendered it
                if (!property || typeof property !== 'object' || !('type' in property)) return null;
                
                let value: string | React.ReactNode | null = '';
                
                // Type the property properly
                const typedProperty = property as {
                  type: string;
                  [key: string]: any;
                };
                
                switch (typedProperty.type) {
                  case 'title':
                    // Already handled above
                    return null;
                  case 'rich_text':
                    value = typedProperty.rich_text?.map((t: { plain_text: string }) => t.plain_text).join('') || '';
                    break;
                  case 'text':
                    value = typedProperty.text?.content || '';
                    break;
                  case 'number':
                    value = typedProperty.number?.toString() || '';
                    break;
                  case 'select':
                    value = typedProperty.select?.name || '';
                    break;
                  case 'multi_select':
                    value = typedProperty.multi_select?.map((s: { name: string }) => s.name).join(', ') || '';
                    break;
                  case 'date':
                    value = typedProperty.date?.start || '';
                    break;
                  case 'people':
                    value = typedProperty.people?.map((p: { name: string }) => p.name).join(', ') || '';
                    break;
                  case 'files':
                    value = `${typedProperty.files?.length || 0} file(s)`;
                    break;
                  case 'checkbox':
                    value = typedProperty.checkbox ? '✓' : '✗';
                    break;
                  case 'url':
                    value = (
                      <a 
                        href={typedProperty.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-emerald-600 hover:underline"
                      >
                        {typedProperty.url}
                      </a>
                    );
                    break;
                  case 'email':
                    value = (
                      <a href={`mailto:${typedProperty.email}`} className="text-emerald-600 hover:underline">
                        {typedProperty.email}
                      </a>
                    );
                    break;
                  case 'phone_number':
                    value = (
                      <a href={`tel:${typedProperty.phone_number}`} className="text-emerald-600 hover:underline">
                        {typedProperty.phone_number}
                      </a>
                    );
                    break;
                  default:
                    value = JSON.stringify(typedProperty);
                }
                
                return (
                  <div key={key} className="mt-2 text-sm">
                    <span className="font-medium text-gray-600">{key}:</span>{' '}
                    <span className="text-gray-800">
                      {typeof value === 'string' ? value : value}
                    </span>
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No data found in this database.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotionDataFetcher;
```

### Step 3: Alternative - Using the Provided Service File
Alternatively, you can use the service file created in the frontend directory. Copy the `pnc-api-service.js` file to your Next.js project's `src/lib/` directory:

```bash
cp pnc-backend/frontend/pnc-api-service.js pnc-web/src/lib/
```

Then use it in your components:

```jsx
// Example usage in a component
import pncApiService from '@/lib/pnc-api-service';

const MyComponent = () => {
  const [databases, setDatabases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDatabases = async () => {
      try {
        const data = await pncApiService.getPncDatabases();
        setDatabases(data.databases);
      } catch (error) {
        console.error('Error fetching databases:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDatabases();
  }, []);

  // ... rest of component
};
```

## Frontend Usage Examples

### Fetching All Databases
```javascript
const response = await fetch('http://localhost:8000/api/databases');
const data = await response.json();
console.log(data.databases);
```

### Fetching Specific Database Content
```javascript
const response = await fetch('http://localhost:8000/api/databases/your-database-id');
const data = await response.json();
console.log(data.content);
```

### Fetching PNC-Specific Databases
```javascript
const response = await fetch('http://localhost:8000/api/pnc-databases');
const data = await response.json();
console.log(data.databases);
```

### Searching Databases by Name
```javascript
const response = await fetch('http://localhost:8000/api/search-databases?name=members');
const data = await response.json();
console.log(data.databases);
```

## Error Handling
All endpoints return error details in the response body when an error occurs:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Security Note
For production use, the CORS settings should be more restrictive, allowing only your frontend domain.