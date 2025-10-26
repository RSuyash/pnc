"""
Notion Integration Test with Provided Token
This script tests the Notion integration using the provided token and page URL.
"""
import os
import requests
from typing import Dict, List, Any, Optional

class NotionTester:
    def __init__(self, integration_token: str):
        self.integration_token = integration_token
        self.headers = {
            "Authorization": f"Bearer {integration_token}",
            "Content-Type": "application/json",
            "Notion-Version": "2022-06-28"
        }
        self.base_url = "https://api.notion.com/v1"
    
    def test_connection(self) -> Dict[str, Any]:
        """Test basic connection to Notion API"""
        try:
            response = requests.get(
                f"{self.base_url}/users",
                headers=self.headers
            )
            response.raise_for_status()
            data = response.json()
            return {
                "success": True,
                "message": "Connection successful",
                "data": data
            }
        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "message": f"Connection failed: {str(e)}",
                "data": None
            }
    
    def search_databases(self) -> Dict[str, Any]:
        """Search for all databases the integration can access"""
        try:
            response = requests.post(
                f"{self.base_url}/search",
                headers=self.headers,
                json={
                    "filter": {
                        "property": "object",
                        "value": "database"
                    }
                }
            )
            response.raise_for_status()
            data = response.json()
            return {
                "success": True,
                "message": f"Found {len(data.get('results', []))} databases",
                "data": data
            }
        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "message": f"Search failed: {str(e)}",
                "data": None
            }

    def search_all_pages(self) -> Dict[str, Any]:
        """Search for all pages and databases the integration can access"""
        try:
            response = requests.post(
                f"{self.base_url}/search",
                headers=self.headers,
                json={}  # Empty body to get all accessible content
            )
            response.raise_for_status()
            data = response.json()
            return {
                "success": True,
                "message": f"Found {len(data.get('results', []))} total objects",
                "data": data
            }
        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "message": f"Search failed: {str(e)}",
                "data": None
            }

    def get_database_content(self, database_id: str) -> Dict[str, Any]:
        """Get content from a specific database"""
        try:
            response = requests.post(
                f"{self.base_url}/databases/{database_id}/query",
                headers=self.headers
            )
            response.raise_for_status()
            data = response.json()
            return {
                "success": True,
                "message": f"Retrieved {len(data.get('results', []))} records",
                "data": data
            }
        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "message": f"Failed to get database content: {str(e)}",
                "data": None
            }

    def get_database_schema(self, database_id: str) -> Dict[str, Any]:
        """Get schema (property structure) of a specific database"""
        try:
            response = requests.get(
                f"{self.base_url}/databases/{database_id}",
                headers=self.headers
            )
            response.raise_for_status()
            data = response.json()
            return {
                "success": True,
                "message": "Retrieved database schema",
                "data": data
            }
        except requests.exceptions.RequestException as e:
            return {
                "success": False,
                "message": f"Failed to get database schema: {str(e)}",
                "data": None
            }

def print_database_info(database_data: Dict[str, Any]):
    """Pretty print information about a database"""
    print(f"\n--- Database: {database_data['title'][0]['plain_text'] if database_data['title'] else 'Untitled'} ---")
    print(f"ID: {database_data['id']}")
    print("Properties:")
    for prop_name, prop_details in database_data['properties'].items():
        print(f"  - {prop_name}: {prop_details['type']}")

def main():
    print("Notion Integration Test")
    print("="*50)
    
    # Use the provided token
    token = os.getenv("NOTION_TOKEN", "")
    
    if not token:
        print("Error: No integration token provided")
        return
    
    tester = NotionTester(token)
    
    print("\n1. Testing basic connection...")
    result = tester.test_connection()
    if result['success']:
        print(f"   OK {result['message']}")
        print(f"   Found {len(result['data'].get('results', []))} users")
    else:
        print(f"   ERROR {result['message']}")
        return

    print("\n2. Searching for all accessible content...")
    result = tester.search_all_pages()
    if result['success']:
        print(f"   OK {result['message']}")
        
        # Count databases vs pages
        databases = [obj for obj in result['data']['results'] if obj['object'] == 'database']
        pages = [obj for obj in result['data']['results'] if obj['object'] == 'page']
        print(f"   - {len(databases)} Databases")
        print(f"   - {len(pages)} Pages")
        
        if databases:
            print("\n3. Databases found:")
            for i, db in enumerate(databases, 1):
                title = db.get('title', [{'plain_text': 'Untitled'}])[0]['plain_text']
                print(f"   {i}. {title} (ID: {db['id']})")
                
                # Get and display schema for each database
                schema_result = tester.get_database_schema(db['id'])
                if schema_result['success']:
                    print("      Properties:")
                    for prop_name, prop_info in schema_result['data']['properties'].items():
                        prop_type = prop_info.get('type', 'unknown')
                        print(f"        - {prop_name}: {prop_type}")
                    
                    # Get a sample of records
                    content_result = tester.get_database_content(db['id'])
                    if content_result['success']:
                        records = content_result['data'].get('results', [])
                        print(f"        - {len(records)} records")
                        if records and records[0].get('properties'):
                            print("        Sample record properties:")
                            sample_props = list(records[0]['properties'].keys())[:3]  # Show first 3 properties
                            for prop in sample_props:
                                print(f"          * {prop}")
                print()  # Empty line
        else:
            print("   No databases found. Make sure your databases are shared with the integration.")
            
        if pages:
            print(f"\n4. Pages found ({len(pages)}):")
            for i, page in enumerate(pages, 1):
                title = page.get('properties', {}).get('title', {}).get('title', [{}])[0].get('text', {}).get('content', 'Untitled') if 'properties' in page else 'Untitled'
                if title == 'Untitled':
                    title_array = page.get('title', [{'plain_text': 'Untitled'}])
                    if title_array and len(title_array) > 0:
                        title = title_array[0].get('plain_text', 'Untitled')
                print(f"   {i}. {title} (ID: {page['id']})")
    else:
        print(f"   ERROR {result['message']}")
    
    print("\n" + "="*50)
    print("Summary:")
    print(f"- Integration token connection: {'SUCCESS' if result['success'] else 'FAILED'}")
    print(f"- Databases accessible: {len([obj for obj in result.get('data', {}).get('results', []) if obj['object'] == 'database']) if result.get('success') else 0}")
    print(f"- Pages accessible: {len([obj for obj in result.get('data', {}).get('results', []) if obj['object'] == 'page']) if result.get('success') else 0}")

if __name__ == "__main__":
    main()