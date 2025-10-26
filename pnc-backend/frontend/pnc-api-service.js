/*
 * PNC Backend API Service
 * Service layer to communicate with the PNC Backend API
 */

const API_BASE_URL = process.env.BACKEND_API_URL || 'http://localhost:8000';

class PncApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request error for ${url}:`, error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/api/health');
  }

  // Test Notion connection
  async testNotionConnection() {
    return this.request('/api/test-connection');
  }

  // Get all databases
  async getAllDatabases() {
    return this.request('/api/databases');
  }

  // Get specific database content
  async getDatabaseContent(databaseId, { filterQuery = null, sorts = null, pageSize = null } = {}) {
    let url = `/api/databases/${databaseId}`;
    const params = new URLSearchParams();
    
    if (filterQuery) params.append('filter_query', JSON.stringify(filterQuery));
    if (sorts) params.append('sorts', JSON.stringify(sorts));
    if (pageSize) params.append('page_size', pageSize.toString());
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    return this.request(url);
  }

  // Get database schema
  async getDatabaseSchema(databaseId) {
    return this.request(`/api/databases/${databaseId}/schema`);
  }

  // Get all pages
  async getAllPages() {
    return this.request('/api/pages');
  }

  // Get specific page content
  async getPageContent(pageId) {
    return this.request(`/api/pages/${pageId}`);
  }

  // Get PNC-specific databases
  async getPncDatabases() {
    return this.request('/api/pnc-databases');
  }

  // Get PNC database content with pagination
  async getPncDatabaseContent(databaseId, { pageSize = 50, page = 1 } = {}) {
    const params = new URLSearchParams({
      page_size: pageSize.toString(),
      page: page.toString(),
    });
    
    return this.request(`/api/pnc-database-content/${databaseId}?${params.toString()}`);
  }

  // Search databases by name
  async searchDatabases(name) {
    const params = new URLSearchParams({ name });
    return this.request(`/api/search-databases?${params.toString()}`);
  }

  // Search all content
  async searchAllContent() {
    return this.request('/api/search-all');
  }
}

// Create a singleton instance
const pncApiService = new PncApiService();

export default pncApiService;

// Export for direct use
export {
  PncApiService
};