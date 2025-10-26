"""
Simple script to check if Suyash Rahegaonkar is properly connected in Notion
"""
import asyncio
import os
import sys

# Add the backend directory to the path so we can import
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

async def check_suyash_in_notion():
    print("Checking Suyash Rahegaonkar in Notion database...")
    
    # Create a direct connection
    from notion_client import Client
    from dotenv import load_dotenv
    
    load_dotenv()
    token = os.getenv("NOTION_TOKEN", "")
    notion = Client(auth=token)
    
    try:
        # Get the Members Directory database
        members_db_id = "289dcc13-e216-801c-baf1-df60dd887141"
        
        print(f"Querying database: {members_db_id}")
        
        # Query for Suyash by email
        db_content = notion.databases.query(
            database_id=members_db_id,
            filter={
                "property": "Student Educational Email",
                "email": {
                    "equals": "1332250296@mitwpu.edu.in"
                }
            }
        )
        
        suyash_entries = db_content.get("results", [])
        if suyash_entries:
            print("[SUCCESS] Found Suyash Rahegaonkar in Notion database!")
            entry = suyash_entries[0]
            properties = entry.get("properties", {})
            
            # Print key information
            print(f"Full Name: {properties.get('Full Name', {}).get('title', [{}])[0].get('plain_text', 'N/A')}")
            print(f"Email: {properties.get('Student Educational Email', {}).get('email', 'N/A')}")
            print(f"Role: {properties.get('Role', {}).get('select', {}).get('name', 'N/A')}")
            print(f"Department: {properties.get('Department', {}).get('select', {}).get('name', 'N/A')}")
            print(f"Status: {properties.get('Status', {}).get('status', {}).get('name', 'N/A')}")
            print(f"Year: {properties.get('Year', {}).get('select', {}).get('name', 'N/A')}")
            
            # Check if we have image fields
            print("\nChecking for image fields:")
            image_fields = []
            for prop_name, prop_value in properties.items():
                prop_lower = prop_name.lower()
                if any(img_keyword in prop_lower for img_keyword in ["image", "photo", "picture", "avatar"]):
                    image_fields.append(prop_name)
            
            if image_fields:
                print(f"Found image fields: {image_fields}")
            else:
                print("No explicit image fields found")
                
            return True
        else:
            print("[FAILURE] Suyash Rahegaonkar not found with email 1332250296@mitwpu.edu.in")
            return False
            
    except Exception as e:
        print(f"[ERROR] Failed to connect to Notion: {str(e)}")
        return False

if __name__ == "__main__":
    result = asyncio.run(check_suyash_in_notion())
    if result:
        print("\n[CONCLUSION] Suyash Rahegaonkar IS in the Notion database.")
        print("The issue is likely in the frontend code that's not properly finding him.")
    else:
        print("\n[CONCLUSION] Could not verify Suyash Rahegaonkar in Notion database.")