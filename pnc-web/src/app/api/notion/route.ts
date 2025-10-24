// app/api/notion/route.ts
import { NextRequest } from 'next/server';
import { getDatabasesFromPage, getDatabaseContent, getDatabaseSchema } from '@/lib/notion';

export async function GET(request: NextRequest, { params }: { params?: Promise<any> }) {
  try {
    // The parent page ID from your URL: https://www.notion.so/pncorg/PNC-287dcc13e2168056aa67ef98a3fe08c4
    const parentPageId = '287dcc13e2168056aa67ef98a3fe08c4';
    
    // Get all databases under the parent page
    const databases = await getDatabasesFromPage(parentPageId);
    
    // Fetch content from each database
    const databasesWithContent = await Promise.all(
      databases.map(async (db: any) => {
        const content = await getDatabaseContent(db.id);
        const schema = await getDatabaseSchema(db.id);
        
        return {
          id: db.id,
          title: db.title?.map((t: any) => t.plain_text).join('') || 'Untitled',
          content: content,
          schema: (schema as any)?.properties || {}
        };
      })
    );

    return Response.json({
      success: true,
      databases: databasesWithContent,
      count: databasesWithContent.length,
      message: `${databasesWithContent.length} databases found and fetched`
    });
  } catch (error) {
    console.error('Error in Notion API route:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}