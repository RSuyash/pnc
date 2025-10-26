/*
 * PNC Data Service
 * Service layer to handle PNC-specific data from the backend
 */

import pncApiService from './pnc-api-service';

export interface Member {
  id: string;
  properties: {
    [key: string]: any;
  };
}

export interface Project {
  id: string;
  properties: {
    [key: string]: any;
  };
}

export interface Task {
  id: string;
  properties: {
    [key: string]: any;
  };
}

class PncDataService {
  private membersDatabaseId: string | null = null;
  private projectsDatabaseId: string | null = null;
  private tasksDatabaseId: string | null = null;

  async initializeDatabaseIds() {
    try {
      // Find the database IDs based on their names
      const allDatabases = await pncApiService.getAllDatabases();
      
      if (allDatabases.success) {
        for (const db of allDatabases.databases) {
          const title = db.title.toLowerCase();
          
          if (title.includes('member') || title.includes('members')) {
            this.membersDatabaseId = db.id;
          } else if (title.includes('project') || title.includes('projects')) {
            this.projectsDatabaseId = db.id;
          } else if (title.includes('task') || title.includes('tasks')) {
            this.tasksDatabaseId = db.id;
          }
        }
      }
    } catch (error) {
      console.error('Error initializing database IDs:', error);
    }
  }

  async getMembers(): Promise<Member[]> {
    if (!this.membersDatabaseId) {
      await this.initializeDatabaseIds();
    }

    if (this.membersDatabaseId) {
      const result = await pncApiService.getDatabaseContent(this.membersDatabaseId);
      if (result.success) {
        return result.content as Member[];
      }
    }

    return [];
  }

  async getProjects(): Promise<Project[]> {
    if (!this.projectsDatabaseId) {
      await this.initializeDatabaseIds();
    }

    if (this.projectsDatabaseId) {
      const result = await pncApiService.getDatabaseContent(this.projectsDatabaseId);
      if (result.success) {
        return result.content as Project[];
      }
    }

    return [];
  }

  async getTasks(): Promise<Task[]> {
    if (!this.tasksDatabaseId) {
      await this.initializeDatabaseIds();
    }

    if (this.tasksDatabaseId) {
      const result = await pncApiService.getDatabaseContent(this.tasksDatabaseId);
      if (result.success) {
        return result.content as Task[];
      }
    }

    return [];
  }

  async getProjectsByStatus(status: string): Promise<Project[]> {
    const allProjects = await this.getProjects();
    return allProjects.filter(project => {
      const projectStatus = project.properties.Status?.select?.name || '';
      return projectStatus.toLowerCase() === status.toLowerCase();
    });
  }

  async getActiveProjects(): Promise<Project[]> {
    return this.getProjectsByStatus('Active');
  }

  async getCompletedProjects(): Promise<Project[]> {
    return this.getProjectsByStatus('Completed');
  }

  async getMembersByRole(role: string): Promise<Member[]> {
    const allMembers = await this.getMembers();
    return allMembers.filter(member => {
      const memberRole = member.properties.Role?.select?.name || '';
      return memberRole.toLowerCase() === role.toLowerCase();
    });
  }

  async getMembersByDepartment(department: string): Promise<Member[]> {
    const allMembers = await this.getMembers();
    return allMembers.filter(member => {
      const memberDept = member.properties.Department?.select?.name || '';
      return memberDept.toLowerCase() === department.toLowerCase();
    });
  }

  async searchMembers(query: string): Promise<Member[]> {
    const allMembers = await this.getMembers();
    const lowerQuery = query.toLowerCase();
    
    return allMembers.filter(member => {
      const fullName = member.properties['Full Name']?.title?.[0]?.plain_text || '';
      const email = member.properties['Student Educational Email']?.email || '';
      
      return (
        fullName.toLowerCase().includes(lowerQuery) ||
        email.toLowerCase().includes(lowerQuery)
      );
    });
  }

  async searchProjects(query: string): Promise<Project[]> {
    const allProjects = await this.getProjects();
    const lowerQuery = query.toLowerCase();
    
    return allProjects.filter(project => {
      const name = project.properties['Project Name']?.title?.[0]?.plain_text || '';
      const description = project.properties['Goal / Desired Outcome']?.rich_text?.[0]?.plain_text || '';
      
      return (
        name.toLowerCase().includes(lowerQuery) ||
        description.toLowerCase().includes(lowerQuery)
      );
    });
  }

  async getMemberById(memberId: string): Promise<Member | null> {
    const allMembers = await this.getMembers();
    return allMembers.find(member => member.id === memberId) || null;
  }

  async getProjectById(projectId: string): Promise<Project | null> {
    const allProjects = await this.getProjects();
    return allProjects.find(project => project.id === projectId) || null;
  }
}

// Create a singleton instance
const pncDataService = new PncDataService();

export default pncDataService;