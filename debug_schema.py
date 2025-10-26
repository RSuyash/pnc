import sys
import os

# Add the backend to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'pnc-backend'))

from services.notion_service import notion_service


async def debug_schema():
    print("Debugging database schema...")
    
    # First, find the members database
    db_result = await notion_service.search_databases()
    if not db_result["success"]:
        print("Failed to search databases")
        return
    
    members_db = None
    for db in db_result["databases"]:
        if "member" in db["title"].lower() or "team" in db["title"].lower():
            members_db = db
            break
    
    if not members_db:
        print("Members database not found")
        return
    
    print(f"Found members database: {members_db['title']}")
    
    # Get the schema
    schema_result = await notion_service.get_database_schema(members_db["id"])
    if not schema_result["success"]:
        print("Failed to get database schema")
        return
    
    database_schema = schema_result["schema"]
    print("\nFull schema:")
    for prop_name, prop_info in database_schema.items():
        print(f"  {prop_name}: {prop_info}")
        
    print("\nDetailed schema info:")
    for prop_name, prop_info in database_schema.items():
        print(f"\nProperty: {prop_name}")
        print(f"  Type: {prop_info.get('type')}")
        if prop_info.get('type') == 'select':
            options = prop_info.get('options', [])
            print(f"  Options: {[opt.get('name') for opt in options]}")
        elif prop_info.get('type') == 'multi_select':
            options = prop_info.get('options', [])
            print(f"  Options: {[opt.get('name') for opt in options]}")
        print(f"  Raw info: {prop_info}")


if __name__ == "__main__":
    import asyncio
    asyncio.run(debug_schema())