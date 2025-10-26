"""
Application services for member management
"""
from typing import List, Dict, Any, Optional
from datetime import datetime
import asyncio

from domain.models.member import Member, Role, UserStatus
from infrastructure.external_apis.notion_service import notion_service


class MemberService:
    def __init__(self):
        self.notion_service = notion_service

    async def get_all_members(self) -> List[Dict[str, Any]]:
        """Get all members from Notion database"""
        db_id, error = await self._find_members_database()
        if error:
            raise Exception(f"Could not find members database: {error}")
        
        content_result = await self.notion_service.get_database_content(db_id)
        if not content_result["success"]:
            raise Exception(f"Could not get members content: {content_result['message']}")
        
        return content_result["content"]

    async def get_member_by_id(self, member_id: str) -> Optional[Dict[str, Any]]:
        """Get member by ID from Notion"""
        db_id, error = await self._find_members_database()
        if error:
            return None
        
        # In Notion, we get all content and filter by ID
        all_members = await self.get_all_members()
        for member in all_members:
            if member["id"] == member_id:
                return member
        
        return None

    async def search_members(self, query: str) -> List[Dict[str, Any]]:
        """Search members by name or other fields"""
        all_members = await self.get_all_members()
        matching_members = []
        
        for member in all_members:
            properties = member.get("properties", {})
            
            # Search in name fields
            for prop_name, prop_value in properties.items():
                if "name" in prop_name.lower() or prop_name.lower() == "title":
                    member_name = await self.notion_service.format_property_value(
                        prop_name, {"type": "text"}, prop_value
                    )
                    if query.lower() in str(member_name).lower():
                        matching_members.append(member)
                        break
        
        return matching_members

    async def get_member_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Search for a member by email address"""
        all_members = await self.get_all_members()
        
        for member in all_members:
            properties = member.get("properties", {})
            
            # Look for email in the properties
            for prop_name, prop_value in properties.items():
                # Check for common email field names
                if ("email" in prop_name.lower() or 
                    "mail" in prop_name.lower() or 
                    prop_name.lower() in ["student educational email", "personal email", "contact email"]):
                    
                    member_email = await self.notion_service.format_property_value(
                        prop_name, {"type": "text"}, prop_value
                    )
                    
                    # Check if this matches our target email
                    if member_email and str(member_email).lower() == email.lower():
                        return member
        
        return None

    async def get_members_by_status(self, status: str) -> List[Dict[str, Any]]:
        """Get members by status"""
        all_members = await self.get_all_members()
        filtered_members = []
        
        for member in all_members:
            properties = member.get("properties", {})
            
            # Find status property
            for prop_name, prop_value in properties.items():
                if "status" in prop_name.lower():
                    member_status = await self.notion_service.format_property_value(
                        prop_name, {"type": "text"}, prop_value
                    )
                    if str(member_status).lower() == status.lower():
                        filtered_members.append(member)
                        break
        
        return filtered_members

    async def get_members_by_department(self, department: str) -> List[Dict[str, Any]]:
        """Get members by department"""
        all_members = await self.get_all_members()
        filtered_members = []
        
        for member in all_members:
            properties = member.get("properties", {})
            
            # Find department property
            for prop_name, prop_value in properties.items():
                if "department" in prop_name.lower():
                    member_department = await self.notion_service.format_property_value(
                        prop_name, {"type": "text"}, prop_value
                    )
                    if str(member_department).lower() == department.lower():
                        filtered_members.append(member)
                        break
        
        return filtered_members

    async def get_member_statistics(self) -> Dict[str, Any]:
        """Get comprehensive member statistics"""
        all_members = await self.get_all_members()
        
        stats = {
            "total_members": len(all_members),
            "departments": {},
            "statuses": {},
            "years": {},
            "roles": {}
        }
        
        for member in all_members:
            properties = member.get("properties", {})
            
            # Count by department
            for prop_name, prop_value in properties.items():
                if "department" in prop_name.lower():
                    dept = await self.notion_service.format_property_value(
                        prop_name, {"type": "text"}, prop_value
                    )
                    if dept:
                        dept_str = str(dept)
                        stats["departments"][dept_str] = stats["departments"].get(dept_str, 0) + 1
                        break
            
            # Count by status
            for prop_name, prop_value in properties.items():
                if "status" in prop_name.lower():
                    stat = await self.notion_service.format_property_value(
                        prop_name, {"type": "text"}, prop_value
                    )
                    if stat:
                        stat_str = str(stat)
                        stats["statuses"][stat_str] = stats["statuses"].get(stat_str, 0) + 1
                        break
            
            # Count by year
            for prop_name, prop_value in properties.items():
                if "year" in prop_name.lower():
                    year = await self.notion_service.format_property_value(
                        prop_name, {"type": "text"}, prop_value
                    )
                    if year:
                        year_str = str(year)
                        stats["years"][year_str] = stats["years"].get(year_str, 0) + 1
                        break
            
            # Count by role
            for prop_name, prop_value in properties.items():
                if "role" in prop_name.lower():
                    role = await self.notion_service.format_property_value(
                        prop_name, {"type": "text"}, prop_value
                    )
                    if role:
                        role_str = str(role)
                        stats["roles"][role_str] = stats["roles"].get(role_str, 0) + 1
                        break
        
        return stats

    async def _find_members_database(self) -> tuple[Optional[str], Optional[str]]:
        """Find the members database in Notion"""
        db_result = await self.notion_service.search_databases()
        if not db_result["success"]:
            return None, db_result["message"]
        
        for db in db_result["databases"]:
            if "member" in db["title"].lower() or "team" in db["title"].lower():
                return db["id"], None
        
        return None, "Members database not found"