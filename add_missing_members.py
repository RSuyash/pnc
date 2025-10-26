import asyncio
import sys
import os

# Add the backend to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'pnc-backend'))

from services.notion_service import notion_service

async def main():
    print("Adding missing members to Notion database...")
    
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
        # Let's list all databases to help find it
        print("\nAvailable databases:")
        for db in db_result["databases"]:
            print(f"  - {db['title']} (ID: {db['id']})")
        return
    
    print(f"Found members database: {members_db['title']}")
    
    # Get the schema to make sure we use correct property names
    schema_result = await notion_service.get_database_schema(members_db["id"])
    if not schema_result["success"]:
        print("Failed to get database schema")
        return
    
    database_schema = schema_result["schema"]
    print("Database schema retrieved successfully")
    
    # Map the expected field names based on the schema
    field_mappings = {}
    for prop_name, prop_info in database_schema.items():
        lower_prop_name = prop_name.lower()
        if "name" in lower_prop_name or "full" in lower_prop_name:
            field_mappings["Full Name"] = prop_name
        elif "role" in lower_prop_name:
            field_mappings["Role"] = prop_name
        elif "department" in lower_prop_name:
            field_mappings["Department"] = prop_name
        elif "status" in lower_prop_name:
            field_mappings["Status"] = prop_name

    print("Field mappings:", field_mappings)
    
    # The missing members based on our comparison
    missing_members = [
        {"Full Name": "Krishnandu Sarkar", "Role": "Research Head", "Department": "Research", "Status": "Inactive"},
        {"Full Name": "Priya Kadam", "Role": "Vice - President", "Department": "Executive", "Status": "Inactive"},
        {"Full Name": "Jui Dicholkar", "Role": "Media Head", "Department": "Media", "Status": "Inactive"},
        {"Full Name": "Parth Borkar", "Role": "Treasurer", "Department": "Executive", "Status": "Inactive"},
        {"Full Name": "Saartha Kamble", "Role": "Secretary", "Department": "Executive", "Status": "Inactive"},
    ]
    
    results = []
    for member in missing_members:
        print(f"Adding member: {member['Full Name']}")
        
        # Create properties dictionary with the correct field names from the schema
        properties = {}
        
        # Add the known fields with correct property names from the schema
        for field_key, field_value in member.items():
            if field_key in field_mappings:
                prop_name = field_mappings[field_key]
                prop_info = database_schema[prop_name]
                
                # Format the value according to the property type
                if prop_info["type"] == "title":
                    properties[prop_name] = {
                        "title": [{"text": {"content": field_value}}]
                    }
                elif prop_info["type"] == "rich_text":
                    properties[prop_name] = {
                        "rich_text": [{"text": {"content": field_value}}]
                    }
                elif prop_info["type"] == "select":
                    # Check if the value exists in the available options
                    options = [opt["name"] for opt in prop_info.get("options", [])]
                    print(f"    Processing {prop_name} select field, options: {options}")
                    if field_value in options:
                        properties[prop_name] = {"select": {"name": field_value}}
                    else:
                        print(f"    Value '{field_value}' not in options, using first available: {options[0] if options else 'default'}")
                        # Use first available option
                        if options:
                            properties[prop_name] = {"select": {"name": options[0]}}
                        else:
                            properties[prop_name] = {"select": {"name": field_value}}
                elif prop_info["type"] == "multi_select":
                    # Check if the value exists in the available options
                    options = [opt["name"] for opt in prop_info.get("options", [])]
                    print(f"    Processing {prop_name} multi-select field, options: {options}")
                    if field_value in options:
                        properties[prop_name] = {"multi_select": [{"name": field_value}]}
                    else:
                        print(f"    Value '{field_value}' not in options, using first available: {options[0] if options else 'default'}")
                        # Use first available option
                        if options:
                            properties[prop_name] = {"multi_select": [{"name": options[0]}]}
                        else:
                            properties[prop_name] = {"multi_select": [{"name": field_value}]}
                elif prop_info["type"] == "status":
                    # Check if the value exists in the available status options
                    options = [opt["name"] for opt in prop_info.get("status", {}).get("options", [])]
                    print(f"    Processing {prop_name} status field, options: {options}")
                    if field_value in options:
                        properties[prop_name] = {"status": {"name": field_value}}
                    else:
                        print(f"    Value '{field_value}' not in status options, using first available: {options[0] if options else 'default'}")
                        if options:
                            properties[prop_name] = {"status": {"name": options[0]}}
                        else:
                            properties[prop_name] = {"status": {"name": field_value}}
                elif prop_info["type"] == "email":
                    properties[prop_name] = {"email": field_value if "@" in field_value else ""}
                elif prop_info["type"] == "phone_number":
                    properties[prop_name] = {"phone_number": field_value if field_value.replace("-", "").replace(" ", "").isdigit() else ""}
                elif prop_info["type"] == "number":
                    try:
                        properties[prop_name] = {"number": float(field_value) if field_value else 0}
                    except ValueError:
                        properties[prop_name] = {"number": 0}
                elif prop_info["type"] == "checkbox":
                    properties[prop_name] = {"checkbox": field_value.lower() in ['true', 'yes', '1', 'active'] if isinstance(field_value, str) else bool(field_value)}
                elif prop_info["type"] == "date":
                    # For now, skip date fields or use a default
                    pass
                elif prop_info["type"] == "url":
                    properties[prop_name] = {"url": field_value if field_value.startswith("http") else ""}
                else:
                    # Default to rich_text for unknown types
                    properties[prop_name] = {
                        "rich_text": [{"text": {"content": str(field_value)}}]
                    }
        
        # Add any required properties that weren't filled yet
        for prop_name, prop_info in database_schema.items():
            if prop_name not in properties and prop_info.get("required", False):
                # Set default values for required properties
                if prop_info["type"] == "title":
                    properties[prop_name] = {"title": [{"text": {"content": "Default"}}]}
                elif prop_info["type"] == "rich_text":
                    properties[prop_name] = {"rich_text": [{"text": {"content": ""}}]}
                elif prop_info["type"] == "select" and prop_info.get("options"):
                    properties[prop_name] = {"select": {"name": prop_info["options"][0]["name"]}}
                elif prop_info["type"] == "email":
                    properties[prop_name] = {"email": ""}
                elif prop_info["type"] == "phone_number":
                    properties[prop_name] = {"phone_number": ""}
                elif prop_info["type"] == "number":
                    properties[prop_name] = {"number": 0}
                elif prop_info["type"] == "checkbox":
                    properties[prop_name] = {"checkbox": False}
                elif prop_info["type"] == "multi_select" and prop_info.get("options"):
                    properties[prop_name] = {"multi_select": [{"name": prop_info["options"][0]["name"]}]}
                elif prop_info["type"] == "url":
                    properties[prop_name] = {"url": ""}
        
        result = await notion_service.create_database_entry(members_db["id"], properties)
        results.append({
            "member": member["Full Name"],
            "success": result["success"],
            "message": result["message"]
        })
        
        if result["success"]:
            print(f"  [SUCCESS] Successfully added {member['Full Name']}")
        else:
            print(f"  [FAILED] Failed to add {member['Full Name']}: {result['message']}")
    
    print(f"\nCompleted! Attempted to add {len(missing_members)} members.")
    print(f"Successes: {sum(1 for r in results if r['success'])}")
    print(f"Failures: {sum(1 for r in results if not r['success'])}")

if __name__ == "__main__":
    asyncio.run(main())