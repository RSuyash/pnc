// src/hooks/useDashboardAPI.ts
import React from 'react';
import DashboardAPIClient from '@/services/dashboardAPI';

interface FilterParams {
  department?: string;
  status?: string;
  year?: string;
}

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

interface APIResponse<T> {
  success: boolean;
  [key: string]: any;
}

// React Hooks for easy integration in React components
export function useDashboardAPI() {
  const client = React.useMemo(() => new DashboardAPIClient(), []);

  const getSummary = React.useCallback(async () => {
    return await client.getDashboardSummary();
  }, [client]);

  const searchMembers = React.useCallback(async (query: string) => {
    return await client.searchMembers(query);
  }, [client]);

  const getStatistics = React.useCallback(async () => {
    return await client.getMemberStatistics();
  }, [client]);

  const filterMembers = React.useCallback(async (filters: FilterParams = {}) => {
    return await client.filterMembers(filters);
  }, [client]);

  const getDepartments = React.useCallback(async () => {
    return await client.getDepartments();
  }, [client]);

  return {
    getSummary,
    searchMembers,
    getStatistics,
    filterMembers,
    getDepartments,
    bulkUpdateMembers: client.bulkUpdateMembers.bind(client),
    getActiveMembers: client.getActiveMembers.bind(client),
    getResearchMembers: client.getResearchMembers.bind(client),
    getYear2526Members: client.getYear2526Members.bind(client)
  };
}

// React Hook with loading states
export function useDashboardData() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { getSummary, searchMembers, getStatistics, filterMembers } = useDashboardAPI();

  const loadDashboardSummary = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      return await getSummary();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getSummary]);

  const searchMembersWithLoading = React.useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      return await searchMembers(query);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [searchMembers]);

  return {
    loading,
    error,
    loadDashboardSummary,
    searchMembers: searchMembersWithLoading,
    getStatistics,
    filterMembers
  };
}