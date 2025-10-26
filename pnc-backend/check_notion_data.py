"""
Script to check what's in the Notion database
"""
import sys
import os
import asyncio

# Add the backend directory to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.notion_service import notion_service

async def check_notion_data():
    print("Checking Notion databases...")
    
    # Get all databases
    db_result = await notion_service.search_databases()
    if not db_result["success"]:
        print(f"Error searching databases: {db_result['message']}")
        return
    
    print(f"Found {len(db_result['databases'])} databases:")
    for db in db_result["databases"]:
        print(f"  - {db['title']} (ID: {db['id']})")
    
    # Look for member/team databases specifically
    member_dbs = [db for db in db_result["databases"] 
                  if "member" in db["title"].lower() or "team" in db["title"].lower()]
    
    if not member_dbs:
        print("\nNo member/team databases found. Looking at all databases...")
        member_dbs = db_result["databases"]  # Check all if no member db found
    
    # For each member database, get the schema and content
    for db in member_dbs:
        print(f"\nAnalyzing database: {db['title']}")
        
        # Get schema
        schema_result = await notion_service.get_database_schema(db["id"])
        if schema_result["success"]:
            print("  Schema properties:")
            for prop_name, prop_info in schema_result["schema"].items():
                print(f"    - {prop_name}: {prop_info['type']}")
        else:
            print(f"  Error getting schema: {schema_result['message']}")
        
        # Get content
        content_result = await notion_service.get_database_content(db["id"])
        if content_result["success"]:
            print(f"  Found {content_result['count']} entries:")
            for i, entry in enumerate(content_result["content"][:5]):  # Show first 5 entries
                print(f"    Entry {i+1}:")
                for prop_name, prop_value in entry.get("properties", {}).items():
                    value_str = str(prop_value)[:100]  # Limit length for readability
                    print(f"      {prop_name}: {value_str}")
        else:
            print(f"  Error getting content: {content_result['message']}")

if __name__ == "__main__":
    asyncio.run(check_notion_data())