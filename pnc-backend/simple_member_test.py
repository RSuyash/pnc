#!/usr/bin/env python3
"""
Simple test script to explore member data from Notion
"""
import asyncio
import sys
from pathlib import Path

# Add the backend directory to the path
backend_path = Path(__file__).parent
sys.path.insert(0, str(backend_path))

from infrastructure.external_apis.notion_service import notion_service

async def test_member_data():
    """Test fetching member data from Notion"""
    print("Testing member data access...")
    
    try:
        # Test connection
        print("Testing connection...")
        connection_result = await notion_service.test_connection()
        print(f"Connection: {connection_result}")
        
        if not connection_result["success"]:
            print("Connection failed!")
            return
            
        # Search for databases
        print("\nSearching for databases...")
        db_result = await notion_service.search_databases()
        print(f"Databases found: {db_result['success']}")
        
        if not db_result["success"]:
            print("Failed to search databases")
            return
            
        databases = db_result["databases"]
        print(f"Found {len(databases)} databases")
        
        # Look for members directory
        members_db = None
        for db in databases:
            title = db.get("title", "").lower()
            if "member" in title or "team" in title:
                members_db = db
                break
                
        if not members_db:
            if databases:
                members_db = databases[0]  # Use first database
                print("Using first database")
            else:
                print("No databases found")
                return
                
        print(f"Using database: {members_db.get('title', 'Untitled')}")
        
        # Get database content
        db_id = members_db["id"]
        print(f"Database ID: {db_id}")
        
        content_result = await notion_service.get_database_content(db_id)
        print(f"Content fetch: {content_result['success']}")
        
        if not content_result["success"]:
            print("Failed to get database content")
            return
            
        content = content_result["content"]
        print(f"Found {len(content)} items")
        
        # Show first item structure
        if content:
            first_item = content[0]
            print(f"\nFirst item ID: {first_item.get('id')}")
            print("First item properties:")
            properties = first_item.get("properties", {})
            for prop_name, prop_value in properties.items():
                print(f"  {prop_name}: {prop_value}")
                
        # Look for a specific email
        target_email = "1332250296@mitwpu.edu.in"
        print(f"\nSearching for: {target_email}")
        
        found_item = None
        for item in content:
            properties = item.get("properties", {})
            for prop_name, prop_value in properties.items():
                # Check if this is an email property
                if "email" in prop_name.lower():
                    # Process the property value
                    if isinstance(prop_value, dict):
                        email_value = notion_service._process_property(prop_value)
                    else:
                        email_value = prop_value
                        
                    if email_value and str(email_value).lower() == target_email.lower():
                        found_item = item
                        print(f"Found matching email in property: {prop_name}")
                        print(f"Email value: {email_value}")
                        break
                        
            if found_item:
                break
                
        if found_item:
            print("SUCCESS: Found the target member!")
            print("Member details:")
            properties = found_item.get("properties", {})
            for prop_name, prop_value in properties.items():
                if isinstance(prop_value, dict):
                    processed_value = notion_service._process_property(prop_value)
                else:
                    processed_value = prop_value
                print(f"  {prop_name}: {processed_value}")
        else:
            print("INFO: Target member not found in email properties")
            # Try to find any property with the target email
            for item in content:
                properties = item.get("properties", {})
                for prop_name, prop_value in properties.items():
                    if isinstance(prop_value, dict):
                        processed_value = notion_service._process_property(prop_value)
                    else:
                        processed_value = prop_value
                        
                    if str(processed_value).lower() == target_email.lower():
                        print(f"Found match in property: {prop_name}")
                        print(f"Value: {processed_value}")
                        break
                        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_member_data())