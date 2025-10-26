# Integration Guide: Connecting pnc-web Frontend to Python Backend

This guide will help you integrate your existing Next.js frontend in `pnc-web` with the new Python backend.

## Quick Setup Steps

### 1. Start the Python Backend
In a terminal, navigate to the backend directory and start the server:
```bash
cd pnc-backend
python start_server.py
```

### 2. Update Frontend Environment Variables
In your `pnc-web` directory, create or update the `.env.local` file:
```env
BACKEND_API_URL=http://localhost:8000
NOTION_TOKEN=your_notion_integration_token_here
```

### 3. Update Your Existing Notion Integration
You have two options for updating your frontend:

#### Option A: Update API Calls (Recommended)
Replace the direct Notion API calls in your existing components with calls to the Python backend:

In `src/components/notion/NotionDataFetcher.tsx`, update the fetch calls to use the backend:
- Change `fetch('/api/notion')` to `fetch('${process.env.BACKEND_API_URL}/api/pnc-databases')`
- Change `fetch('/api/notion/db/${id}')` to `fetch('${process.env.BACKEND_API_URL}/api/databases/${id}')`

#### Option B: Use the Provided Service
Copy the service file to your frontend:
```bash
cp pnc-backend/frontend/pnc-api-service.js pnc-web/src/lib/
```

Then import and use it in your components:
```javascript
import pncApiService from '@/lib/pnc-api-service';

// Example usage
const fetchData = async () => {
  try {
    const databases = await pncApiService.getPncDatabases();
    // Process the data as needed
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
```

### 4. Update API Route Usage
Since the Python backend now handles all Notion API communication, you can remove or comment out the existing API routes in `pnc-web/src/app/api/notion/` if you're fully migrating to the Python backend.

### 5. Update the Notion Integration Page
Update `src/app/notion-integration/page.tsx` to use the backend service:
- Modify the component to fetch data from the Python backend
- The component structure remains the same, only the data source changes

## Benefits of This Integration

1. **Security**: Notion token is stored on the backend, not exposed to the frontend
2. **Scalability**: Backend can handle more complex operations and caching
3. **Maintainability**: Centralized API logic in Python backend
4. **Flexibility**: Can easily add additional data sources and processing

## Testing the Integration

1. Start both servers:
   - Backend: `cd pnc-backend && python start_server.py`
   - Frontend: `cd pnc-web && npm run dev`

2. Visit `http://localhost:3000/notion-integration` to see your Notion data through the Python backend

3. Check the browser developer tools for any API errors

4. The Python backend API documentation is available at `http://localhost:8000/docs`

## Troubleshooting

**CORS Issues**: If you encounter CORS errors, make sure the backend is running and the frontend is making requests to the correct URL.

**Database Not Found**: Ensure your Notion databases are shared with your integration token.

**Environment Variables**: Verify that `BACKEND_API_URL` is correctly set in your frontend's environment files.

## Next Steps

After successful integration, you can:
- Add caching mechanisms in the backend
- Implement real-time updates using WebSocket connections
- Add additional data processing capabilities
- Enhance security with authentication