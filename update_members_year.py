import asyncio
import sys
import os

# Add the backend to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'pnc-backend'))

from data_management import data_management_service


async def update_members_with_year():
    print("Updating members with year information based on their status...")
    
    result = await data_management_service.update_members_with_year_based_on_status()
    
    if result["success"]:
        print(f"[SUCCESS] {result['message']}")
        print(f"Updated: {result['updated_count']} members")
        print(f"Failed: {result['failed_count']} members")
        
        if result['failed_updates']:
            print("\nFailed updates:")
            for failed in result['failed_updates']:
                print(f"  - Page ID {failed['page_id']}: {failed['error']}")
    else:
        print(f"[ERROR] {result['message']}")


if __name__ == "__main__":
    asyncio.run(update_members_with_year())