"""
Member Data Service for PNC Backend
Handles fetching and processing member data from Notion database
"""
import asyncio
from typing import Dict, Any, List, Optional
from infrastructure.external_apis.notion_service import notion_service

class MemberDataService:
    """Service for fetching and processing member data from Notion"""
    
    def __init__(self):
        self.notion_service = notion_service
        self._members_database_id = None
        
    async def _get_members_database_id(self) -> Optional[str]:
        """Get the members database ID"""
        if self._members_database_id:
            return self._members_database_id
            
        # Search for databases
        db_result = await self.notion_service.search_databases()
        if not db_result["success"]:
            return None
            
        databases = db_result["databases"]
        
        # Look for members directory
        for db in databases:
            title = db.get("title", "").lower()
            if "member" in title or "team" in title:
                self._members_database_id = db["id"]
                return self._members_database_id
                
        # If not found, return None
        return None
        
    async def get_member_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """
        Get member data by email address
        
        Args:
            email: Email address to search for
            
        Returns:
            Dictionary containing member data or None if not found
        """
        try:
            # Get members database ID
            db_id = await self._get_members_database_id()
            if not db_id:
                print("Members database not found")
                return None
                
            # Get database content
            content_result = await self.notion_service.get_database_content(db_id)
            if not content_result["success"]:
                print("Failed to get database content")
                return None
                
            content = content_result["content"]
            
            # Search for member with matching email
            for item in content:
                properties = item.get("properties", {})
                
                # Look for email property
                for prop_name, prop_value in properties.items():
                    if "email" in prop_name.lower():
                        # Process the property value
                        if isinstance(prop_value, dict):
                            member_email = self.notion_service._process_property(prop_value)
                        else:
                            member_email = prop_value
                            
                        # Check if emails match
                        if member_email and str(member_email).lower() == email.lower():
                            # Found the member, process and return the data
                            return await self._process_member_data(item)
                            
            # Member not found
            return None
            
        except Exception as e:
            print(f"Error getting member by email: {e}")
            return None
            
    async def get_all_members(self) -> List[Dict[str, Any]]:
        """
        Get all members from the database
        
        Returns:
            List of dictionaries containing member data
        """
        try:
            # Get members database ID
            db_id = await self._get_members_database_id()
            if not db_id:
                print("Members database not found")
                return []
                
            # Get database content
            content_result = await self.notion_service.get_database_content(db_id)
            if not content_result["success"]:
                print("Failed to get database content")
                return []
                
            content = content_result["content"]
            
            # Process all members
            members = []
            for item in content:
                processed_member = await self._process_member_data(item)
                if processed_member:
                    members.append(processed_member)
                    
            return members
            
        except Exception as e:
            print(f"Error getting all members: {e}")
            return []
            
    async def search_members(self, query: str) -> List[Dict[str, Any]]:
        """
        Search members by name or other fields
        
        Args:
            query: Search query
            
        Returns:
            List of dictionaries containing member data
        """
        try:
            # Get all members
            all_members = await self.get_all_members()
            
            # Filter by query
            matching_members = []
            for member in all_members:
                # Check name fields
                full_name = member.get("full_name", "")
                if query.lower() in full_name.lower():
                    matching_members.append(member)
                    continue
                    
                # Check department
                department = member.get("department", "")
                if query.lower() in department.lower():
                    matching_members.append(member)
                    continue
                    
                # Check role
                role = member.get("role", "")
                if query.lower() in role.lower():
                    matching_members.append(member)
                    continue
                    
            return matching_members
            
        except Exception as e:
            print(f"Error searching members: {e}")
            return []
            
    async def get_member_statistics(self) -> Dict[str, Any]:
        """
        Get statistics about all members
        
        Returns:
            Dictionary containing member statistics
        """
        try:
            # Get all members
            all_members = await self.get_all_members()
            
            stats = {
                "total_members": len(all_members),
                "departments": {},
                "roles": {},
                "statuses": {},
                "years": {}
            }
            
            # Count by department
            for member in all_members:
                department = member.get("department", "Unknown")
                stats["departments"][department] = stats["departments"].get(department, 0) + 1
                
                # Count by role
                role = member.get("role", "Unknown")
                stats["roles"][role] = stats["roles"].get(role, 0) + 1
                
                # Count by status
                status = member.get("status", "Unknown")
                stats["statuses"][status] = stats["statuses"].get(status, 0) + 1
                
                # Count by year
                year = member.get("year", "Unknown")
                stats["years"][year] = stats["years"].get(year, 0) + 1
                
            return stats
            
        except Exception as e:
            print(f"Error getting member statistics: {e}")
            return {"total_members": 0, "departments": {}, "roles": {}, "statuses": {}, "years": {}}
            
    async def _process_member_data(self, item: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Process raw Notion item data into clean member data
        
        Args:
            item: Raw Notion database item
            
        Returns:
            Dictionary containing processed member data or None
        """
        try:
            properties = item.get("properties", {})
            
            # Process member data
            member_data = {
                "id": item.get("id"),
                "created_time": item.get("created_time"),
                "last_edited_time": item.get("last_edited_time"),
                "properties": {}
            }
            
            # Process each property
            for prop_name, prop_value in properties.items():
                # Process the property value
                if isinstance(prop_value, dict):
                    processed_value = self.notion_service._process_property(prop_value)
                else:
                    processed_value = prop_value
                    
                # Map common property names to standardized fields
                prop_lower = prop_name.lower()
                if "name" in prop_lower or prop_lower == "title":
                    member_data["full_name"] = str(processed_value) if processed_value else ""
                elif "email" in prop_lower:
                    member_data["email"] = str(processed_value) if processed_value else ""
                elif "role" in prop_lower:
                    member_data["role"] = str(processed_value) if processed_value else ""
                elif "department" in prop_lower:
                    member_data["department"] = str(processed_value) if processed_value else ""
                elif "status" in prop_lower:
                    member_data["status"] = str(processed_value) if processed_value else ""
                elif "year" in prop_lower:
                    member_data["year"] = str(processed_value) if processed_value else ""
                    
                # Store all properties
                member_data["properties"][prop_name] = processed_value
                
            return member_data
            
        except Exception as e:
            print(f"Error processing member data: {e}")
            return None

# Create singleton instance
member_data_service = MemberDataService()

# Test the service
async def test_member_service():
    """Test the member data service"""
    print("Testing Member Data Service...")
    
    # Test getting member by email
    email = "1332250296@mitwpu.edu.in"
    member = await member_data_service.get_member_by_email(email)
    
    if member:
        print(f"SUCCESS: Found member {member.get('full_name', 'Unknown')}")
        print(f"Email: {member.get('email', 'Unknown')}")
        print(f"Role: {member.get('role', 'Unknown')}")
        print(f"Department: {member.get('department', 'Unknown')}")
        print(f"Status: {member.get('status', 'Unknown')}")
    else:
        print("FAILED: Member not found")
        
    # Test getting statistics
    stats = await member_data_service.get_member_statistics()
    print(f"\nMember Statistics:")
    print(f"Total members: {stats['total_members']}")
    print(f"Departments: {stats['departments']}")
    print(f"Roles: {stats['roles']}")

if __name__ == "__main__":
    asyncio.run(test_member_service())