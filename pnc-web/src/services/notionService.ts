// src/services/notionService.ts
import axios from 'axios';

interface NotionUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
  year: string;
  [key: string]: any; // Allow additional fields
}

class NotionService {
  private baseURL: string;
  private notionToken: string | undefined;

  constructor() {
    this.baseURL = 'http://localhost:8000/api'; // Backend API that connects to Notion
    this.notionToken = process.env.NOTION_TOKEN; // Would be needed in real implementation
  }

  async searchDatabases() {
    try {
      const response = await axios.get(`${this.baseURL}/databases`);
      return response.data;
    } catch (error) {
      console.error('Error searching Notion databases:', error);
      throw error;
    }
  }

  async searchAllContent() {
    try {
      const response = await axios.get(`${this.baseURL}/search-all`);
      return response.data;
    } catch (error) {
      console.error('Error searching Notion content:', error);
      throw error;
    }
  }

  async getDatabaseContent(databaseId: string) {
    try {
      const response = await axios.get(`${this.baseURL}/databases/${databaseId}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting content from database ${databaseId}:`, error);
      throw error;
    }
  }

  async searchPNCUsersByEmail(email: string): Promise<NotionUser | null> {
    try {
      // Call the backend endpoint that handles searching for users by email in Notion
      // With the new API versioning, the endpoint is at /api/v1/dashboard/search-user-by-email
      const response = await axios.get(`${this.baseURL}/v1/dashboard/search-user-by-email?email=${encodeURIComponent(email)}`);
      
      if (response.data.success && response.data.user) {
        const userData = response.data.user;
        return {
          id: userData.id,
          name: userData.name || 'Unknown',
          email: userData.email,
          role: userData.role || 'Member',
          department: userData.department || 'General',
          status: userData.status || 'Active',
          year: userData.year || '25-26',
          image: userData.image || undefined
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error searching for user in Notion:', error);
      return null;
    }
  }
}

export const notionService = new NotionService();
export default notionService;