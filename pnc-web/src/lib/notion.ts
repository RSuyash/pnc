// src/lib/notion.ts
import { Client } from '@notionhq/client';

// Initialize the Notion client with the integration token
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// Define simple types for our usage
interface DatabaseObject {
  id: string;
  title?: Array<{ plain_text: string }>;
  parent?: {
    type: string;
    page_id?: string;
    database_id?: string;
  };
  properties?: Record<string, any>;
  [key: string]: any;
}

interface PageObject {
  id: string;
  properties?: Record<string, any>;
  [key: string]: any;
}

// Function to get all databases under a parent page
export async function getDatabasesFromPage(pageId: string): Promise<DatabaseObject[]> {
  try {
    // Clean the page ID (remove dashes if they exist in the format)
    const cleanPageId = pageId.replace(/-/g, '');
    
    // Query the parent page to find all linked databases
    const response: any = await notion.search({
      query: '',
      filter: {
        property: 'object',
        value: 'database' as any
      }
    });

    // Filter databases that are under the specified parent page
    const databases = response.results.filter((result: any) => {
      return result.parent && 
             ((result.parent.type === 'page_id' && result.parent.page_id === cleanPageId) ||
              (result.parent.type === 'database_id' && result.parent.database_id === cleanPageId));
    }) as DatabaseObject[];

    return databases;
  } catch (error) {
    console.error('Error fetching databases:', error);
    return [];
  }
}

// Function to get database content
export async function getDatabaseContent(databaseId: string): Promise<any[]> {
  try {
    const response: any = await (notion.databases as any).query({
      database_id: databaseId,
    });
    return response.results;
  } catch (error) {
    console.error(`Error fetching database ${databaseId}:`, error);
    return [];
  }
}

// Function to get database structure/schema
export async function getDatabaseSchema(databaseId: string): Promise<DatabaseObject | null> {
  try {
    const response: DatabaseObject = await notion.databases.retrieve({
      database_id: databaseId,
    });
    return response;
  } catch (error) {
    console.error(`Error fetching schema for database ${databaseId}:`, error);
    return null;
  }
}

// Function to get page content
export async function getPageContent(pageId: string): Promise<PageObject | null> {
  try {
    const response: PageObject = await notion.pages.retrieve({
      page_id: pageId,
    });
    return response;
  } catch (error) {
    console.error(`Error fetching page ${pageId}:`, error);
    return null;
  }
}

export default notion;