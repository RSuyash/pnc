/**
 * Dashboard API Client for PNC Web Frontend
 * TypeScript client to consume dashboard API endpoints
 */

interface DashboardSummary {
  total_members: number;
  active_members: number;
  members_with_tasks: number;
  active_percentage: number;
  engagement_rate: number;
  timestamp: string;
}

interface Member {
  id: string;
  properties: {
    [key: string]: any;
  };
}

interface FilterParams {
  department?: string;
  status?: string;
  year?: string;
}

interface BulkUpdateRequest {
  filter: {
    [key: string]: any;
  };
  updates: {
    [key: string]: any;
  };
}

interface APIResponse<T> {
  success: boolean;
  [key: string]: any;
}

interface MemberStats {
  total_members: number;
  departments: { [key: string]: number };
  statuses: { [key: string]: number };
  years: { [key: string]: number };
  roles: { [key: string]: number };
}

class DashboardAPIClient {
  private baseURL: string;

  constructor(baseURL = 'http://localhost:8000/api') {
    this.baseURL = baseURL;
  }

  // Set authorization header with JWT token
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || ''}`
    };
  }

  // Get dashboard summary for admins
  async getDashboardSummary(): Promise<APIResponse<{ summary: DashboardSummary }>> {
    try {
      const response = await fetch(`${this.baseURL}/dashboard/summary`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: APIResponse<{ summary: DashboardSummary }> = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw error;
    }
  }

  // Search members by name
  async searchMembers(query: string): Promise<APIResponse<{ members: Member[]; count: number }>> {
    try {
      const response = await fetch(`${this.baseURL}/dashboard/members/search?query=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: APIResponse<{ members: Member[]; count: number }> = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching members:', error);
      throw error;
    }
  }

  // Get member statistics
  async getMemberStatistics(): Promise<APIResponse<{ statistics: MemberStats }>> {
    try {
      const response = await fetch(`${this.baseURL}/dashboard/members/stats`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: APIResponse<{ statistics: MemberStats }> = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching member statistics:', error);
      throw error;
    }
  }

  // Filter members by department, status, or year
  async filterMembers(filters: FilterParams = {}): Promise<APIResponse<{ members: Member[]; count: number }>> {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (filters.department) queryParams.append('department', filters.department);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.year) queryParams.append('year', filters.year);

      const queryString = queryParams.toString();
      const url = `${this.baseURL}/dashboard/members/filter${queryString ? '?' + queryString : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: APIResponse<{ members: Member[]; count: number }> = await response.json();
      return data;
    } catch (error) {
      console.error('Error filtering members:', error);
      throw error;
    }
  }

  // Get all unique departments
  async getDepartments(): Promise<APIResponse<{ departments: string[] }>> {
    try {
      const response = await fetch(`${this.baseURL}/dashboard/members/departments`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: APIResponse<{ departments: string[] }> = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  }

  // Bulk update members
  async bulkUpdateMembers(filter: { [key: string]: any }, updates: { [key: string]: any }): Promise<APIResponse<any>> {
    try {
      const response = await fetch(`${this.baseURL}/dashboard/members/bulk-update`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          filter: filter,
          updates: updates
        } as BulkUpdateRequest)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: APIResponse<any> = await response.json();
      return data;
    } catch (error) {
      console.error('Error in bulk update:', error);
      throw error;
    }
  }

  // Example: Get active members only
  async getActiveMembers(): Promise<APIResponse<{ members: Member[]; count: number }>> {
    return await this.filterMembers({ status: 'Active' });
  }

  // Example: Get members in Research department
  async getResearchMembers(): Promise<APIResponse<{ members: Member[]; count: number }>> {
    return await this.filterMembers({ department: 'Research' });
  }

  // Example: Get 25-26 cohort members
  async getYear2526Members(): Promise<APIResponse<{ members: Member[]; count: number }>> {
    return await this.filterMembers({ year: '25-26' });
  }
}

export default DashboardAPIClient;