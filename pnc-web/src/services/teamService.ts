// src/services/teamService.ts
import { TEAM_DATA, TeamMember } from '@/data/team';
import notionService from './notionService';

class TeamService {
  /**
   * Find a team member by email - first checks local data, then Notion as fallback
   */
  async findMemberByEmail(email: string): Promise<TeamMember | any | undefined> {
    // First try to find in local team data
    let member = TEAM_DATA.find(member => 
      member.email.toLowerCase() === email.toLowerCase()
    );
    
    if (member) {
      return member;
    }
    
    // If not found locally, try to get from Notion
    try {
      const notionMember = await notionService.searchPNCUsersByEmail(email);
      if (notionMember) {
        // Convert Notion data to TeamMember-like structure
        return {
          id: notionMember.id || 0,
          name: notionMember.name,
          role: notionMember.role,
          department: notionMember.department,
          email: notionMember.email,
          status: notionMember.status,
          // Add other fields as needed based on Notion data
        };
      }
    } catch (error) {
      console.warn('Could not fetch from Notion, using local data only:', error);
    }
    
    return undefined;
  }

  /**
   * Find a team member by full name - first checks local data, then Notion as fallback
   */
  async findMemberByName(fullName: string): Promise<TeamMember | any | undefined> {
    // First try to find in local team data
    let member = TEAM_DATA.find(member => 
      member.name.toLowerCase() === fullName.toLowerCase() ||
      member.name.toLowerCase().includes(fullName.toLowerCase())
    );
    
    if (member) {
      return member;
    }
    
    // If not found locally, try to get from Notion
    try {
      // This would require a different approach in Notion service 
      // For now, we'll just return undefined
      // In a full implementation, we'd search Notion by name
    } catch (error) {
      console.warn('Could not fetch from Notion, using local data only:', error);
    }
    
    return undefined;
  }

  /**
   * Get all active team members from local data
   */
  getAllActiveMembers(): TeamMember[] {
    return TEAM_DATA.filter(member => member.status === 'Active');
  }

  /**
   * Get all team members in a specific department from local data
   */
  getMembersByDepartment(department: string): TeamMember[] {
    return TEAM_DATA.filter(member => 
      member.department.toLowerCase() === department.toLowerCase()
    );
  }

  /**
   * Get a team member by ID from local data
   */
  getMemberById(id: number): TeamMember | undefined {
    return TEAM_DATA.find(member => member.id === id);
  }
}

export const teamService = new TeamService();
export default teamService;