// test_notion.js - Simple script to test Notion connection and check data
const axios = require('axios');

async function testNotionConnection() {
  try {
    console.log('Testing Notion connection...');
    
    // Test getting databases
    console.log('Fetching databases...');
    const databasesResponse = await axios.get('http://localhost:8000/api/databases');
    console.log('Databases:', databasesResponse.data);
    
    // Test getting all content
    console.log('Fetching all content...');
    const allContentResponse = await axios.get('http://localhost:8000/api/search-all');
    console.log('All content:', allContentResponse.data);
    
    // Test getting PNC-specific databases
    console.log('Fetching PNC databases...');
    const pncDatabasesResponse = await axios.get('http://localhost:8000/api/pnc-databases');
    console.log('PNC databases:', pncDatabasesResponse.data);
    
    // If PNC databases exist, get content from each
    if (pncDatabasesResponse.data.databases && pncDatabasesResponse.data.databases.length > 0) {
      for (const db of pncDatabasesResponse.data.databases) {
        console.log(`Fetching content from database: ${db.title} (ID: ${db.id})`);
        try {
          const dbContent = await axios.get(`http://localhost:8000/api/databases/${db.id}`);
          console.log(`Content in ${db.title}:`, dbContent.data);
        } catch (err) {
          console.error(`Error fetching content from ${db.title}:`, err.message);
        }
      }
    }
    
  } catch (error) {
    console.error('Error connecting to Notion API:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testNotionConnection();