"""
Detailed script to fetch Suyash Rahegaonkar's complete data from Notion
"""
import asyncio
import os
import sys

# Add the backend directory to the path so we can import
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.notion_service import notion_service

async def detailed_suyash_test():
    print("Fetching detailed information for Suyash Rahegaonkar from Notion...")
    
    # Create a direct connection
    from notion_client import Client
    from dotenv import load_dotenv
    
    load_dotenv()
    token = os.getenv("NOTION_TOKEN", "")
    notion = Client(auth=token)
    
    try:
        # Get all databases
        print("\nSearching for databases...")
        result = notion.search(query="", filter={"property": "object", "value": "database"})
        databases = result.get("results", [])
        
        print(f"Found {len(databases)} databases")
        
        # Look for the Members Directory database
        members_db = None
        for db in databases:
            title = ""
            if "title" in db and isinstance(db["title"], list) and len(db["title"]) > 0:
                title = db["title"][0].get("plain_text", "Untitled")
            
            if "Members Directory" in title:
                members_db = db
                print(f"\nFound Members Directory: {title} (ID: {db['id']})")
                break
        
        if not members_db:
            print("Members Directory not found!")
            return
        
        # Get the database schema to see all available fields
        print("\nFetching database schema...")
        db_info = notion.databases.retrieve(database_id=members_db['id'])
        schema = db_info.get("properties", {})
        
        print("Available fields:")
        for field_name, field_info in schema.items():
            field_type = field_info.get("type", "unknown")
            print(f"  - {field_name} ({field_type})")
        
        # Query the database for Suyash specifically
        print("\nSearching for Suyash Rahegaonkar...")
        db_content = notion.databases.query(
            database_id=members_db['id'],
            filter={
                "property": "Full Name",
                "rich_text": {
                    "contains": "Suyash"
                }
            }
        )
        
        suyash_entries = db_content.get("results", [])
        if not suyash_entries:
            print("No entries found for Suyash")
            return
        
        print(f"\nFound {len(suyash_entries)} entry/entries for Suyash")
        
        # Process the entry
        for i, entry in enumerate(suyash_entries):
            print(f"\n=== Entry {i+1} ===")
            print(f"Page ID: {entry['id']}")
            print(f"Created: {entry.get('created_time', 'Unknown')}")
            print(f"Last Edited: {entry.get('last_edited_time', 'Unknown')}")
            
            properties = entry.get("properties", {})
            print("\nProperties:")
            
            for prop_name, prop_value in properties.items():
                prop_type = prop_value.get("type", "unknown")
                
                # Extract value based on type
                value = "N/A"
                if prop_type == "title" and prop_value.get("title"):
                    value = prop_value["title"][0].get("plain_text", "")
                elif prop_type == "rich_text" and prop_value.get("rich_text"):
                    value = prop_value["rich_text"][0].get("plain_text", "")
                elif prop_type == "email":
                    value = prop_value.get("email", "")
                elif prop_type == "select" and prop_value.get("select"):
                    value = prop_value["select"].get("name", "")
                elif prop_type == "multi_select" and prop_value.get("multi_select"):
                    value = [opt.get("name", "") for opt in prop_value["multi_select"]]
                elif prop_type == "status" and prop_value.get("status"):
                    value = prop_value["status"].get("name", "")
                elif prop_type == "number":
                    value = prop_value.get("number", "")
                elif prop_type == "checkbox":
                    value = prop_value.get("checkbox", False)
                elif prop_type == "url":
                    value = prop_value.get("url", "")
                elif prop_type == "phone_number":
                    value = prop_value.get("phone_number", "")
                elif prop_type == "date" and prop_value.get("date"):
                    value = prop_value["date"].get("start", "")
                elif prop_type == "files" and prop_value.get("files"):
                    value = [f.get("name", "") for f in prop_value["files"]]
                else:
                    value = str(prop_value)[:100] + "..." if len(str(prop_value)) > 100 else str(prop_value)
                
                print(f"  {prop_name}: {value}")
            
            # Check if this is the right Suyash
            name_prop = properties.get("Full Name", {})
            if name_prop.get("type") == "title" and name_prop.get("title"):
                full_name = name_prop["title"][0].get("plain_text", "")
                if "Rahegaonkar" in full_name:
                    print(f"\n✓ CONFIRMED: This is Suyash Rahegaonkar ({full_name})")
                    email_prop = properties.get("Email", {})
                    if email_prop.get("type") == "email":
                        email = email_prop.get("email", "")
                        if email == "1332250296@mitwpu.edu.in":
                            print("✓ Email matches our database")
                        else:
                            print(f"! Email mismatch: Expected 1332250296@mitwpu.edu.in, got {email}")
            
            # Look for image/photo fields
            print("\nLooking for image/photo fields:")
            for prop_name, prop_value in properties.items():
                prop_lower = prop_name.lower()
                if any(img_keyword in prop_lower for img_keyword in ["image", "photo", "picture", "avatar"]):
                    print(f"  Found potential image field: {prop_name}")
                    print(f"    Value: {prop_value}")
    
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(detailed_suyash_test())