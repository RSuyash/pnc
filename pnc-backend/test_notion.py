"""
Script to test Notion connection and check what data exists
"""
import asyncio
import sys
import os

# Add the backend directory to the path so we can import
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.notion_service import notion_service

async def test_notion_data():
    print("Testing Notion connection and data...")
    
    # Test connection
    print("\n1. Testing connection...")
    try:
        # Create a direct connection test since the service method has an issue
        from notion_client import Client
        import os
        from dotenv import load_dotenv
        
        load_dotenv()
        token = os.getenv("NOTION_TOKEN", "")
        notion = Client(auth=token)
        
        # Try a simple search to test connection
        result = notion.search(query="", filter={"property": "object", "value": "database"})
        connection_result = {
            "success": True,
            "message": "Connection successful",
            "result_count": len(result.get("results", []))
        }
        print(f"Connection result: {connection_result}")
    except Exception as e:
        connection_result = {
            "success": False,
            "message": f"Connection failed: {str(e)}"
        }
        print(f"Connection result: {connection_result}")
        return
    
    # Get all databases
    print("\n2. Getting all databases...")
    databases_result = await notion_service.search_databases()
    print(f"Databases found: {databases_result}")
    
    if databases_result["success"]:
        print("\n3. Checking each database...")
        for db in databases_result["databases"]:
            print(f"\n--- Database: {db['title']} (ID: {db['id']}) ---")
            
            # Get schema first
            print("   Getting schema...")
            schema_result = await notion_service.get_database_schema(db["id"])
            if schema_result["success"]:
                print(f"   Schema fields: {list(schema_result['schema'].keys())}")
            
            # Get content
            print("   Getting content...")
            content_result = await notion_service.get_database_content(db["id"])
            if content_result["success"]:
                print(f"   Number of entries: {content_result.get('count', len(content_result.get('content', [])))}")
                
                # Print first few entries to see structure
                entries = content_result.get("content", [])
                for i, entry in enumerate(entries[:3]):  # Show first 3 entries
                    print(f"   Entry {i+1}:")
                    print(f"     ID: {entry.get('id', 'N/A')}")
                    properties = entry.get("properties", {})
                    print(f"     Properties keys: {list(properties.keys())}")
                    
                    # Try to find name/email fields in this entry
                    name_value = None
                    email_value = None
                    
                    for prop_name, prop_value in properties.items():
                        prop_lower = prop_name.lower()
                        
                        # Look for name fields
                        if any(name_field in prop_lower for name_field in ["name", "title", "full"]):
                            if 'title' in prop_value:
                                name_value = prop_value['title'][0]['text']['content'] if prop_value['title'] else None
                            elif 'rich_text' in prop_value:
                                name_value = prop_value['rich_text'][0]['text']['content'] if prop_value['rich_text'] else None
                            elif 'text' in prop_value:
                                name_value = prop_value['text']['content'] if prop_value['text'] else None
                            else:
                                name_value = str(prop_value)
                        
                        # Look for email fields
                        if any(email_field in prop_lower for email_field in ["email", "mail", "e-mail"]):
                            if 'email' in prop_value:
                                email_value = prop_value['email']
                            elif 'rich_text' in prop_value and prop_value['rich_text']:
                                email_value = prop_value['rich_text'][0]['text']['content'] if prop_value['rich_text'][0]['text']['content'] else None
                            elif 'text' in prop_value:
                                email_value = prop_value['text']['content'] if prop_value['text']['content'] else None
                            else:
                                email_value = str(prop_value)
                    
                    if name_value or email_value:
                        print(f"     Name: {name_value}")
                        print(f"     Email: {email_value}")
    
    # Specifically look for Suyash Rahegaonkar
    print("\n4. Looking specifically for Suyash Rahegaonkar...")
    if databases_result["success"]:
        for db in databases_result["databases"]:
            print(f"\n   Searching in database: {db['title']}")
            content_result = await notion_service.get_database_content(db["id"])
            if content_result["success"]:
                entries = content_result.get("content", [])
                for entry in entries:
                    properties = entry.get("properties", {})
                    
                    # Look for entries that might match Suyash Rahegaonkar
                    name_value = None
                    email_value = None
                    entry_id = entry.get("id", "N/A")
                    
                    for prop_name, prop_value in properties.items():
                        prop_lower = prop_name.lower()
                        
                        # Look for name fields
                        if any(name_field in prop_lower for name_field in ["name", "title", "full"]):
                            if 'title' in prop_value and prop_value['title']:
                                name_value = prop_value['title'][0]['text']['content']
                            elif 'rich_text' in prop_value and prop_value['rich_text']:
                                name_value = prop_value['rich_text'][0]['text']['content']
                        
                        # Look for email fields
                        if any(email_field in prop_lower for email_field in ["email", "mail", "e-mail"]):
                            if 'email' in prop_value:
                                email_value = prop_value['email']
                            elif 'rich_text' in prop_value and prop_value['rich_text']:
                                email_value = prop_value['rich_text'][0]['text']['content']
                    
                    # Check if this might be Suyash
                    if name_value and "suyash" in name_value.lower():
                        print(f"   FOUND POTENTIAL MATCH: {name_value} (ID: {entry_id})")
                        print(f"   Email: {email_value}")
                        print(f"   All properties: {properties.keys()}")
                        
                        # Print the full entry structure
                        print(f"   Full entry: {entry}")
                        return  # Found it
    
    print("\n   Suyash Rahegaonkar not found in any database.")

if __name__ == "__main__":
    asyncio.run(test_notion_data())