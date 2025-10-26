// src/services/dashboardService.ts
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

interface ApiConfig {
  token: string;
}

interface DashboardSummary {
  total_members: number;
  active_members: number;
  departments: number;
  roles: number;
  active_percentage: number;
  timestamp: string;
}

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  department: string;
  status: string;
  year: string;
  phone_number?: string;
  created_time: string;
  last_edited_time: string;
  properties: Record<string, any>;
}

export class DashboardService {
  private token: string;

  constructor(config: ApiConfig) {
    this.token = config.token;
  }

  private getAxiosConfig() {
    return {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    };
  }

  /**
   * Get dashboard summary statistics
   */
  async getDashboardSummary(): Promise<{ success: boolean; summary?: DashboardSummary; error?: string }> {
    try {
      const response = await axios.get(`${BASE_URL}/dashboard/summary`, this.getAxiosConfig());
      return response.data;
    } catch (error: any) {
      console.error('Error fetching dashboard summary:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch dashboard summary'
      };
    }
  }

  /**
   * Search for user by email
   */
  async searchUserByEmail(email: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    try {
      const response = await axios.get(
        `${BASE_URL}/dashboard/search-user-by-email?email=${encodeURIComponent(email)}`,
        this.getAxiosConfig()
      );
      return response.data;
    } catch (error: any) {
      console.error('Error searching user by email:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to search user by email'
      };
    }
  }

  /**
   * Get all members (admin only)
   */
  async getAllMembers(): Promise<{ success: boolean; members?: any[]; error?: string }> {
    try {
      const response = await axios.get(`${BASE_URL}/dashboard/members/filter`, this.getAxiosConfig());
      return response.data;
    } catch (error: any) {
      console.error('Error fetching members:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch members'
      };
    }
  }

  /**
   * Search members by query (admin only)
   */
  async searchMembers(query: string): Promise<{ success: boolean; members?: any[]; error?: string }> {
    try {
      const response = await axios.get(
        `${BASE_URL}/dashboard/members/search?query=${encodeURIComponent(query)}`,
        this.getAxiosConfig()
      );
      return response.data;
    } catch (error: any) {
      console.error('Error searching members:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to search members'
      };
    }
  }

  /**
   * Get member statistics (admin only)
   */
  async getMemberStatistics(): Promise<{ success: boolean; statistics?: any; error?: string }> {
    try {
      const response = await axios.get(`${BASE_URL}/dashboard/members/stats`, this.getAxiosConfig());
      return response.data;
    } catch (error: any) {
      console.error('Error fetching member statistics:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Failed to fetch member statistics'
      };
    }
  }
}

// Singleton instance
let dashboardService: DashboardService | null = null;

export const initializeDashboardService = (token: string): DashboardService => {
  // Always create a new instance when initializing to ensure fresh token
  dashboardService = new DashboardService({ token });
  return dashboardService;
};

export const getDashboardService = (): DashboardService | null => {
  return dashboardService;
};

export const clearDashboardService = (): void => {
  dashboardService = null;
};