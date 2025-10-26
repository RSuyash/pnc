#!/usr/bin/env python3
"""
Test script to explore Notion database structure and understand data format
"""
import asyncio
import os
import sys
from pathlib import Path

# Add the backend directory to the path
backend_path = Path(__file__).parent
sys.path.insert(0, str(backend_path))

from infrastructure.external_apis.notion_service import notion_service

async def explore_notion_databases():
    """Explore all databases in Notion workspace"""
    print("Exploring Notion databases...")
    
    try:
        # Test connection first
        print("Testing connection...")
        connection_result = await notion_service.test_connection()
        print(f"Connection result: {connection_result}")
        
        if not connection_result["success"]:
            print("Connection failed!")
            return
            
        print("Connection successful!")
        
        # Search for all databases
        print("\nSearching for databases...")
        db_result = await notion_service.search_databases()
        print(f"Database search result: {db_result}")
        
        if not db_result["success"]:
            print("Database search failed!")
            return
            
        databases = db_result["databases"]
        print(f"Found {len(databases)} databases")
        
        # Display database information
        for i, db in enumerate(databases):
            print(f"\n--- Database {i+1} ---")
            print(f"Title: {db.get('title', 'Untitled')}")
            print(f"ID: {db.get('id')}")
            print(f"Description: {db.get('description', 'No description')}")
            print(f"Created: {db.get('created_time')}")
            print(f"Last Edited: {db.get('last_edited_time')}")
            
            # Show properties schema
            properties = db.get("properties", {})
            print("Properties:")
            for prop_name, prop_info in properties.items():
                prop_type = prop_info.get("type", "unknown")
                print(f"  - {prop_name} ({prop_type})")
        
        # If we found databases, let's look at the content of the first one
        if databases:
            first_db = databases[0]
            db_id = first_db["id"]
            print(f"\nGetting content from database: {first_db.get('title', 'Untitled')} ({db_id})")
            
            content_result = await notion_service.get_database_content(db_id)
            print(f"Content result: {content_result}")
            
            if content_result["success"]:
                content = content_result["content"]
                print(f"Found {len(content)} items in database")
                
                # Show first few items
                for i, item in enumerate(content[:3]):  # Show first 3 items
                    print(f"\n--- Item {i+1} ---")
                    print(f"ID: {item.get('id')}")
                    print(f"Created: {item.get('created_time')}")
                    print(f"Last Edited: {item.get('last_edited_time')}")
                    
                    properties = item.get("properties", {})
                    print("Properties:")
                    for prop_name, prop_value in properties.items():
                        # Format the property value for display
                        formatted_value = notion_service._process_property(prop_value)
                        print(f"  - {prop_name}: {formatted_value}")
            else:
                print("Failed to get database content")
                
    except Exception as e:
        print(f"Error exploring Notion databases: {e}")
        import traceback
        traceback.print_exc()

async def search_specific_member(email="1332250296@mitwpu.edu.in"):
    """Search for a specific member by email"""
    print(f"\nSearching for member with email: {email}")
    
    try:
        # Search for databases first
        db_result = await notion_service.search_databases()
        if not db_result["success"]:
            print("Failed to search databases")
            return
            
        databases = db_result["databases"]
        print(f"Found {len(databases)} databases")
        
        # Look for a members/database with "member" or "team" in the title
        members_db = None
        for db in databases:
            title = db.get("title", "").lower()
            if "member" in title or "team" in title:
                members_db = db
                break
                
        if not members_db:
            print("No members database found, using first database")
            if databases:
                members_db = databases[0]
            else:
                print("No databases found")
                return
                
        print(f"Using database: {members_db.get('title', 'Untitled')}")
        
        # Get content from the database
        db_id = members_db["id"]
        content_result = await notion_service.get_database_content(db_id)
        
        if not content_result["success"]:
            print("Failed to get database content")
            return
            
        content = content_result["content"]
        print(f"Found {len(content)} items in database")
        
        # Search for the specific email
        found_member = None
        for item in content:
            properties = item.get("properties", {})
            
            # Look for email property
            for prop_name, prop_value in properties.items():
                if "email" in prop_name.lower() and prop_value is not None:
                    # Check if prop_value is a dict before processing
                    if isinstance(prop_value, dict):
                        member_email = notion_service._process_property(prop_value)
                        if str(member_email).lower() == email.lower():
                            found_member = item
                            break
                    # If it's already a string, compare directly
                    elif isinstance(prop_value, str) and prop_value.lower() == email.lower():
                        found_member = item
                        break
                        
            if found_member:
                break
                
        if found_member:
            print(f"Found member with email {email}")
            print(f"Member ID: {found_member.get('id')}")
            
            properties = found_member.get("properties", {})
            print("Member properties:")
            for prop_name, prop_value in properties.items():
                formatted_value = notion_service._process_property(prop_value)
                print(f"  - {prop_name}: {formatted_value}")
        else:
            print(f"Member with email {email} not found")
            
    except Exception as e:
        print(f"Error searching for member: {e}")
        import traceback
        traceback.print_exc()

async def main():
    """Main function to run all tests"""
    print("TESTING Notion Database Exploration Script")
    print("=" * 50)
    
    # Test 1: Explore databases
    await explore_notion_databases()
    
    # Test 2: Search for specific member
    await search_specific_member()
    
    print("\nSUCCESS Exploration complete!")

if __name__ == "__main__":
    asyncio.run(main())