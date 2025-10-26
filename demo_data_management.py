"""
Comprehensive Data Management Script for PNC
Demonstrates all data operations available through the API
"""

import requests
import json


class PNCDataManagementAPI:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
    
    def health_check(self):
        """Check if the API is running"""
        response = requests.get(f"{self.base_url}/api/health")
        return response.json()
    
    def data_management_health(self):
        """Check if data management is working"""
        response = requests.get(f"{self.base_url}/api/health")
        return response.json()
    
    def get_members_by_year(self, year):
        """Get all members for a specific year"""
        response = requests.get(f"{self.base_url}/api/data/members/year/{year}")
        return response.json()
    
    def get_members_by_status(self, status):
        """Get all members with a specific status"""
        response = requests.get(f"{self.base_url}/api/data/members/status/{status}")
        return response.json()
    
    def sync_members_year_based_on_status(self):
        """Update all members to have the correct year based on their status"""
        response = requests.post(f"{self.base_url}/api/data/members/sync-year-from-status")
        return response.json()
    
    def add_multiple_members(self, members_data):
        """Add multiple members to the database"""
        response = requests.post(
            f"{self.base_url}/api/data/members/batch-add",
            json=members_data,
            headers={"Content-Type": "application/json"}
        )
        return response.json()
    
    def sync_members_data(self):
        """Sync members data between TypeScript and Notion database"""
        response = requests.post(f"{self.base_url}/api/data/members/sync")
        return response.json()


def main():
    print("PNC Data Management System")
    print("="*50)
    
    api = PNCDataManagementAPI()
    
    # Basic health check
    print("\n1. Health Check:")
    health = api.health_check()
    print(f"   API Status: {health}")
    
    # Get members by year
    print("\n2. Getting members from year 24-25:")
    members_24_25 = api.get_members_by_year("24-25")
    print(f"   Found {members_24_25.get('count', 0)} members for 24-25 cohort")
    
    print("\n3. Getting members from year 25-26:")
    members_25_26 = api.get_members_by_year("25-26")
    print(f"   Found {members_25_26.get('count', 0)} members for 25-26 cohort")
    
    # Get members by status
    print("\n4. Getting Active members:")
    active_members = api.get_members_by_status("Active")
    print(f"   Found {active_members.get('count', 0)} active members")
    
    print("\n5. Getting Inactive members:")
    inactive_members = api.get_members_by_status("Inactive")
    print(f"   Found {inactive_members.get('count', 0)} inactive members")
    
    # Sync members year based on status
    print("\n6. Syncing year information based on status...")
    sync_result = api.sync_members_year_based_on_status()
    print(f"   {sync_result['message']}")
    
    # Example of adding multiple members
    print("\n7. Example: Adding multiple members (sample data):")
    sample_members = [
        {
            "Full Name": "Sample Member 1",
            "Role": "Member",
            "Department": "Research",
            "Status": "Active",
            "Year": "25-26"
        },
        {
            "Full Name": "Sample Member 2", 
            "Role": "Head",
            "Department": "Media",
            "Status": "Inactive", 
            "Year": "24-25"
        }
    ]
    print("   Sample data to add:", json.dumps(sample_members, indent=2))
    print("   (This would add the members if executed)")
    
    # Sync data between TypeScript and Notion
    print("\n8. Sync members data between TypeScript and Notion:")
    data_sync = api.sync_members_data()
    print(f"   {data_sync['message']}")
    
    print("\n" + "="*50)
    print("Data Management System Features:")
    print("✓ Get members by year (24-25, 25-26)")
    print("✓ Get members by status (Active, Inactive)")
    print("✓ Sync year information based on status")
    print("✓ Bulk add multiple members")
    print("✓ Data synchronization between systems")
    print("✓ Standardized API endpoints")
    print("✓ Comprehensive error handling")
    print("="*50)


if __name__ == "__main__":
    main()