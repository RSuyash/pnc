// Simple test to verify the Notion service is working
import notionService from '@/services/notionService';

async function testNotionService() {
  try {
    console.log('Testing Notion service...');
    
    // Test searching for databases
    console.log('Searching for databases...');
    const databasesResult = await notionService.searchDatabases();
    console.log('Databases result:', databasesResult);
    
    if (databasesResult.success) {
      console.log(`Found ${databasesResult.databases.length} databases`);
      
      // Test searching for Suyash in the first database
      if (databasesResult.databases.length > 0) {
        const firstDbId = databasesResult.databases[0].id;
        console.log(`Testing database content for: ${databasesResult.databases[0].title} (${firstDbId})`);
        
        const contentResult = await notionService.getDatabaseContent(firstDbId);
        console.log('Content result:', contentResult);
        
        if (contentResult.success) {
          console.log(`Found ${contentResult.content.length} entries in database`);
          
          // Try to find Suyash
          console.log('Searching for Suyash Rahegaonkar...');
          const suyashResult = await notionService.searchPNCUsersByEmail('1332250296@mitwpu.edu.in');
          console.log('Suyash search result:', suyashResult);
          
          if (suyashResult) {
            console.log('✅ SUCCESS: Found Suyash Rahegaonkar in Notion database!');
            console.log('Name:', suyashResult.name);
            console.log('Email:', suyashResult.email);
            console.log('Role:', suyashResult.role);
          } else {
            console.log('❌ FAILURE: Could not find Suyash Rahegaonkar in Notion database');
          }
        }
      }
    } else {
      console.log('❌ FAILURE: Could not search databases');
      console.log('Error:', databasesResult);
    }
  } catch (error) {
    console.error('❌ ERROR: Failed to test Notion service:', error);
  }
}

// Run the test
testNotionService();