// app/api/notion/db/[id]/route.ts
import { NextRequest } from 'next/server';
import { getDatabaseContent, getDatabaseSchema } from '@/lib/notion';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const awaitedParams = await params;
    const databaseId = awaitedParams.id;
    
    if (!databaseId) {
      return Response.json({
        success: false,
        error: 'Database ID is required'
      }, { status: 400 });
    }
    
    // Fetch the database content and schema
    const content = await getDatabaseContent(databaseId);
    const schema = await getDatabaseSchema(databaseId);
    
    return Response.json({
      success: true,
      databaseId,
      content,
      schema: (schema as any)?.properties || {},
      count: content.length
    });
  } catch (error) {
    console.error('Error fetching specific database:', error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}