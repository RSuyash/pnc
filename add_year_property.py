import asyncio
import sys
import os

# Add the backend to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'pnc-backend'))

from services.notion_service import notion_service


async def add_year_to_members():
    print("Adding year information to members based on their status...")
    
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
    print("\nCurrent properties:")
    for prop_name, prop_info in database_schema.items():
        print(f"  - {prop_name} ({prop_info['type']})")
    
    # Get all members in the database
    content_result = await notion_service.get_database_content(members_db["id"])
    if not content_result["success"]:
        print("Failed to get database content")
        return
    
    # Update members based on their status
    updated_count = 0
    for item in content_result["content"]:
        properties = item.get("properties", {})
        
        # Get the current status
        status = None
        for prop_name, prop_value in properties.items():
            if prop_name.lower() == 'status':
                status = prop_value
                break
        
        # Determine the year based on status
        year_to_set = "24-25" if status == "Inactive" else "25-26" if status == "Active" else "25-26"
        
        # Check if 'Year' property exists in the schema
        year_prop_name = None
        for prop_name in database_schema.keys():
            if prop_name.lower() == 'year':
                year_prop_name = prop_name
                break
        
        if year_prop_name:
            # Prepare update properties
            update_properties = {}
            
            # Get the year property schema to format correctly
            year_prop_info = database_schema[year_prop_name]
            
            if year_prop_info["type"] == "select":
                # Check if the year value is valid for this select field
                valid_options = [opt["name"] for opt in year_prop_info.get("options", [])]
                if year_to_set in valid_options:
                    update_properties[year_prop_name] = {"select": {"name": year_to_set}}
                else:
                    # Use first available option if the desired year is not available
                    if valid_options:
                        update_properties[year_prop_name] = {"select": {"name": valid_options[0]}}
                    else:
                        print(f"  Warning: No options available for Year property in {item['id']}")
                        continue
            elif year_prop_info["type"] == "multi_select":
                valid_options = [opt["name"] for opt in year_prop_info.get("options", [])]
                if year_to_set in valid_options:
                    update_properties[year_prop_name] = {"multi_select": [{"name": year_to_set}]}
                else:
                    # Use first available option if the desired year is not available
                    if valid_options:
                        update_properties[year_prop_name] = {"multi_select": [{"name": valid_options[0]}]}
                    else:
                        print(f"  Warning: No options available for Year property in {item['id']}")
                        continue
            elif year_prop_info["type"] == "rich_text":
                update_properties[year_prop_name] = {"rich_text": [{"text": {"content": year_to_set}}]}
            else:
                print(f"  Warning: Unsupported type {year_prop_info['type']} for Year property in {item['id']}")
                continue
            
            # Update the page
            result = await notion_service.update_database_entry(item["id"], update_properties)
            if result["success"]:
                name = properties.get("Full Name", {}).get("title", [{}])[0].get("text", {}).get("content", "Unknown") if properties.get("Full Name") else "Unknown"
                print(f"  [SUCCESS] Updated {name} with Year: {year_to_set}")
                updated_count += 1
            else:
                print(f"  [FAILED] Failed to update {item['id']}: {result['message']}")
        else:
            print(f"  Note: No 'Year' property found in database schema. You need to add it manually in Notion.")
            print("  To add a Year property in Notion:")
            print("  1. Go to your Members database in Notion")
            print("  2. Click on '+ Add a property'")
            print("  3. Name it 'Year'")
            print("  4. Choose 'Select' type")
            print("  5. Add options: '24-25', '25-26'")
            print("  6. Save the property")
            break  # Only show this message once
    
    print(f"\nCompleted! Updated {updated_count} members with year information.")


if __name__ == "__main__":
    asyncio.run(add_year_to_members())