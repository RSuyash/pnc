"""
Simple script to test Notion connection and check for Suyash Rahegaonkar
"""
import asyncio
import os
import sys

# Add the backend directory to the path so we can import
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.notion_service import notion_service

async def simple_test():
    print("Testing Notion connection...")
    
    # Create a direct connection to test
    from notion_client import Client
    from dotenv import load_dotenv
    
    load_dotenv()
    token = os.getenv("NOTION_TOKEN", "")
    notion = Client(auth=token)
    
    try:
        # Get all databases
        print("\nGetting databases...")
        result = notion.search(query="", filter={"property": "object", "value": "database"})
        databases = result.get("results", [])
        
        print(f"Found {len(databases)} databases")
        
        for i, db in enumerate(databases):
            title = ""
            if "title" in db and isinstance(db["title"], list) and len(db["title"]) > 0:
                title = db["title"][0].get("plain_text", "Untitled")
            elif "properties" in db:  # Sometimes it's a database object
                for prop_name, prop_value in db.get("properties", {}).items():
                    if prop_value.get("type") == "title":
                        # Database object, get the title from properties
                        title = f"Database: {db.get('id', 'Unknown ID')[:8]}"
                        break
            
            print(f"{i+1}. {title} (ID: {db['id']})")
            
            # Get content from this database to look for Suyash
            print(f"   Checking for Suyash Rahegaonkar in this database...")
            try:
                db_content = notion.databases.query(database_id=db['id'])
                
                for item in db_content.get("results", []):
                    properties = item.get("properties", {})
                    
                    name = email = role = department = status = None
                    
                    # Look for various possible name fields
                    for prop_name, prop_value in properties.items():
                        prop_lower = prop_name.lower()
                        
                        if any(name_field in prop_lower for name_field in ["name", "title", "full"]):
                            if prop_value.get("type") == "title" and prop_value["title"]:
                                name = prop_value["title"][0].get("plain_text", "")
                            elif prop_value.get("type") == "rich_text" and prop_value["rich_text"]:
                                name = prop_value["rich_text"][0].get("plain_text", "")
                        
                        if any(email_field in prop_lower for email_field in ["email", "mail", "e-mail"]):
                            if prop_value.get("type") == "email":
                                email = prop_value.get("email", "")
                            elif prop_value.get("type") == "rich_text" and prop_value["rich_text"]:
                                email = prop_value["rich_text"][0].get("plain_text", "")
                        
                        if any(role_field in prop_lower for role_field in ["role", "position", "designation"]):
                            if prop_value.get("type") == "select" and prop_value.get("select"):
                                role = prop_value["select"].get("name", "")
                            elif prop_value.get("type") == "rich_text" and prop_value["rich_text"]:
                                role = prop_value["rich_text"][0].get("plain_text", "")
                    
                    # Check if this is Suyash
                    if name and "suyash" in name.lower():
                        print(f"   FOUND: {name}")
                        print(f"   Email: {email}")
                        print(f"   Role: {role}")
                        print(f"   Page ID: {item['id']}")
                        return  # Found him!
                
                print(f"   No match found in this database")
                
            except Exception as e:
                print(f"   Error accessing database: {str(e)}")
    
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    asyncio.run(simple_test())