import sys
import os
import asyncio

# Add the backend to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'pnc-backend'))

from services.notion_service import notion_service


async def check_year_property():
    print("Checking if Year property exists in the database...")
    
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
    
    # Get the schema to check if 'Year' property exists
    schema_result = await notion_service.get_database_schema(members_db["id"])
    if not schema_result["success"]:
        print("Failed to get database schema")
        return
    
    database_schema = schema_result["schema"]
    print("\nDatabase properties:")
    year_exists = False
    for prop_name, prop_info in database_schema.items():
        print(f"  - {prop_name} ({prop_info['type']})")
        if prop_name.lower() == 'year':
            year_exists = True
            print(f"    Year property found: {prop_info}")
    
    if year_exists:
        print("\n[SUCCESS] Year property exists in the database!")
        
        # Check if it's a select field with the correct options
        year_prop_info = None
        for prop_name, prop_info in database_schema.items():
            if prop_name.lower() == 'year':
                year_prop_info = prop_info
                break
        
        if year_prop_info and year_prop_info['type'] == 'select':
            options = [opt['name'] for opt in year_prop_info.get('select', {}).get('options', [])]
            print(f"Available Year options: {options}")
            
            if '24-25' in options and '25-26' in options:
                print("[SUCCESS] Year property has the correct options (24-25, 25-26)")
            else:
                print("[WARNING] Year property exists but doesn't have expected options (24-25, 25-26)")
        else:
            print(f"[WARNING] Year property is not a select type: {year_prop_info['type'] if year_prop_info else 'unknown'}")
    else:
        print("\n[ERROR] Year property does not exist in the database yet")


if __name__ == "__main__":
    asyncio.run(check_year_property())