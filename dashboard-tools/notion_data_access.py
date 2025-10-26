"""
Powerful Notion Data Access Tools for PNC Dashboard
Provides enhanced functionality for accessing and managing Notion data
"""
import asyncio
import os
import sys
import json
from typing import Dict, List, Any, Optional
from datetime import datetime

# Add backend to path to access notion service
sys.path.append(os.path.join(os.path.dirname(__file__), 'pnc-backend'))

from services.notion_service import notion_service

class EnhancedNotionDataAccess:
    """Enhanced Notion data access with powerful filtering and search capabilities"""
    
    def __init__(self):
        self.notion_service = notion_service
        self.members_db_id = None
        self._discover_databases()
    
    def _discover_databases(self):
        """Discover and identify the main members database"""
        try:
            import asyncio
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            db_result = loop.run_until_complete(self._async_discover_databases())
            loop.close()
            
            # Find members database specifically
            for db in db_result.get("databases", []):
                if "member" in db["title"].lower() or "team" in db["title"].lower() or "directory" in db["title"].lower():
                    self.members_db_id = db["id"]
                    print(f"Found members database: {db['title']} (ID: {db['id']})")
                    break
        except Exception as e:
            print(f"Error discovering databases: {str(e)}")
    
    async def _async_discover_databases(self):
        """Async method to discover databases"""
        return await self.notion_service.search_databases()
    
    async def get_members_database_id(self):
        """Get the members database ID with auto-discovery if needed"""
        if not self.members_db_id:
            db_result = await self.notion_service.search_databases()
            if db_result["success"]:
                for db in db_result["databases"]:
                    if "member" in db["title"].lower() or "team" in db["title"].lower() or "directory" in db["title"].lower():
                        self.members_db_id = db["id"]
                        break
        return self.members_db_id
    
    async def advanced_search_members(self, filters: Optional[Dict] = None, sorts: Optional[List[Dict]] = None) -> Dict[str, Any]:
        """Advanced search with multiple filters and sorting options"""
        db_id = await self.get_members_database_id()
        if not db_id:
            return {"success": False, "message": "Members database not found"}
        
        # Get the database content with optional filters and sorts
        result = await self.notion_service.get_database_content(db_id, 
                                                              filter_query=filters if filters else None,
                                                              sorts=sorts if sorts else None)
        return result
    
    async def get_members_by_department(self, department: str) -> Dict[str, Any]:
        """Get all members for a specific department"""
        filters = {
            "property": "Department",  # Assuming 'Department' is the property name
            "select": {
                "equals": department
            }
        }
        return await self.advanced_search_members(filters=filters)
    
    async def get_members_by_status(self, status: str) -> Dict[str, Any]:
        """Get all members with a specific status"""
        filters = {
            "property": "Status",  # Assuming 'Status' is the property name
            "status": {
                "equals": status
            }
        }
        return await self.advanced_search_members(filters=filters)
    
    async def get_members_by_year(self, year: str) -> Dict[str, Any]:
        """Get all members for a specific year"""
        filters = {
            "property": "Year",  # Assuming 'Year' is the property name
            "select": {
                "equals": year
            }
        }
        return await self.advanced_search_members(filters=filters)
    
    async def get_executive_committee_members(self) -> Dict[str, Any]:
        """Get all executive committee members"""
        filters = {
            "property": "Department",
            "select": {
                "equals": "Executive"
            }
        }
        return await self.advanced_search_members(filters=filters)
    
    async def get_active_members(self) -> Dict[str, Any]:
        """Get all active members"""
        result = await self.notion_service.get_database_content(await self.get_members_database_id())
        
        if not result["success"]:
            return result
            
        active_members = []
        for member in result["content"]:
            properties = member.get("properties", {})
            status = None
            
            # Look for status field in the properties
            for prop_name, prop_value in properties.items():
                if "status" in prop_name.lower():
                    status = prop_value.get("status", {}).get("name")
                    break
            
            if status and status.lower() == "active":
                active_members.append(member)
        
        return {
            "success": True,
            "members": active_members,
            "count": len(active_members)
        }
    
    async def search_members_by_name(self, name_query: str) -> Dict[str, Any]:
        """Search members by name"""
        result = await self.notion_service.get_database_content(await self.get_members_database_id())
        
        if not result["success"]:
            return result
            
        matching_members = []
        for member in result["content"]:
            properties = member.get("properties", {})
            member_name = None
            
            # Look for name field in the properties
            for prop_name, prop_value in properties.items():
                if "name" in prop_name.lower() or prop_name.lower() == "title":
                    member_name = prop_value.get("title") or prop_value.get("rich_text")
                    if isinstance(member_name, list) and len(member_name) > 0:
                        member_name = member_name[0].get("text", {}).get("content", "")
                    break
            
            if member_name and name_query.lower() in member_name.lower():
                matching_members.append(member)
        
        return {
            "success": True,
            "members": matching_members,
            "count": len(matching_members)
        }
    
    async def get_member_statistics(self) -> Dict[str, Any]:
        """Get comprehensive statistics about members"""
        result = await self.notion_service.get_database_content(await self.get_members_database_id())
        
        if not result["success"]:
            return {"success": False, "message": result["message"]}
        
        stats = {
            "total_members": len(result["content"]),
            "departments": {},
            "statuses": {},
            "years": {},
            "roles": {}
        }
        
        for member in result["content"]:
            properties = member.get("properties", {})
            
            # Count by department
            for prop_name, prop_value in properties.items():
                if "department" in prop_name.lower():
                    dept = prop_value.get("select", {}).get("name")
                    if dept:
                        stats["departments"][dept] = stats["departments"].get(dept, 0) + 1
                        break
            
            # Count by status
            for prop_name, prop_value in properties.items():
                if "status" in prop_name.lower():
                    status = prop_value.get("status", {}).get("name")
                    if status:
                        stats["statuses"][status] = stats["statuses"].get(status, 0) + 1
                        break
            
            # Count by year
            for prop_name, prop_value in properties.items():
                if "year" in prop_name.lower():
                    year = prop_value.get("select", {}).get("name")
                    if year:
                        stats["years"][year] = stats["years"].get(year, 0) + 1
                        break
            
            # Count by role
            for prop_name, prop_value in properties.items():
                if "role" in prop_name.lower():
                    role = prop_value.get("select", {}).get("name")
                    if role:
                        stats["roles"][role] = stats["roles"].get(role, 0) + 1
                        break
        
        return {
            "success": True,
            "statistics": stats
        }
    
    async def get_members_with_pending_tasks(self) -> Dict[str, Any]:
        """Get members who have open/active tasks"""
        result = await self.notion_service.get_database_content(await self.get_members_database_id())
        
        if not result["success"]:
            return {"success": False, "message": result["message"]}
        
        members_with_tasks = []
        for member in result["content"]:
            properties = member.get("properties", {})
            
            # Look for Open Tasks or Active Projects fields
            has_tasks = False
            for prop_name, prop_value in properties.items():
                if "task" in prop_name.lower() or "project" in prop_name.lower():
                    task_value = prop_value.get("rich_text") or prop_value.get("title")
                    if task_value and len(task_value) > 0:
                        task_content = task_value[0].get("text", {}).get("content", "")
                        if task_content.strip() != "":
                            has_tasks = True
                            break
            
            if has_tasks:
                members_with_tasks.append(member)
        
        return {
            "success": True,
            "members": members_with_tasks,
            "count": len(members_with_tasks)
        }
    
    async def export_members_to_json(self, filename: Optional[str] = None) -> Dict[str, Any]:
        """Export all members to a JSON file"""
        if not filename:
            filename = f"pnc_members_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        result = await self.notion_service.get_database_content(await self.get_members_database_id())
        
        if not result["success"]:
            return {"success": False, "message": result["message"]}
        
        # Process the data into a more readable format
        processed_members = []
        for member in result["content"]:
            processed_member = {
                "id": member["id"],
                "properties": {},
                "created_time": member.get("created_time"),
                "last_edited_time": member.get("last_edited_time")
            }
            
            for prop_name, prop_value in member.get("properties", {}).items():
                processed_member["properties"][prop_name] = self.notion_service._process_property(prop_value)
            
            processed_members.append(processed_member)
        
        export_data = {
            "export_time": datetime.now().isoformat(),
            "total_members": len(processed_members),
            "members": processed_members
        }
        
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(export_data, f, indent=2, ensure_ascii=False)
        
        return {
            "success": True,
            "message": f"Exported {len(processed_members)} members to {filename}",
            "filename": filename,
            "count": len(processed_members)
        }

# Convenience functions for easy access
async def get_all_members():
    """Quick function to get all members"""
    access = EnhancedNotionDataAccess()
    return await access.notion_service.get_database_content(await access.get_members_database_id())

async def get_active_members():
    """Quick function to get active members"""
    access = EnhancedNotionDataAccess()
    return await access.get_active_members()

async def search_members(name_query):
    """Quick function to search members by name"""
    access = EnhancedNotionDataAccess()
    return await access.search_members_by_name(name_query)

async def get_member_stats():
    """Quick function to get member statistics"""
    access = EnhancedNotionDataAccess()
    return await access.get_member_statistics()

# Command line interface functions
async def run_member_search():
    """Interactive member search"""
    access = EnhancedNotionDataAccess()
    
    print("PNC Member Search Tool")
    print("=" * 30)
    print("Options:")
    print("1. Search by name")
    print("2. Get by department")
    print("3. Get by status")
    print("4. Get by year")
    print("5. Get executive committee")
    print("6. Get active members")
    print("7. Get statistics")
    print("8. Export to JSON")
    
    choice = input("\nEnter your choice (1-8): ").strip()
    
    if choice == "1":
        name = input("Enter name to search: ").strip()
        result = await access.search_members_by_name(name)
    elif choice == "2":
        dept = input("Enter department: ").strip()
        result = await access.get_members_by_department(dept)
    elif choice == "3":
        status = input("Enter status (Active/Inactive): ").strip()
        result = await access.get_members_by_status(status)
    elif choice == "4":
        year = input("Enter year (24-25/25-26): ").strip()
        result = await access.get_members_by_year(year)
    elif choice == "5":
        result = await access.get_executive_committee_members()
    elif choice == "6":
        result = await access.get_active_members()
    elif choice == "7":
        result = await access.get_member_statistics()
    elif choice == "8":
        filename = input("Enter filename (or press Enter for default): ").strip()
        result = await access.export_members_to_json(filename if filename else None)
    else:
        print("Invalid choice")
        return
    
    if result.get("success"):
        if "statistics" in result:
            print("\nStatistics:")
            for key, value in result["statistics"].items():
                print(f"  {key}: {value}")
        elif "members" in result:
            print(f"\nFound {result.get('count', len(result.get('members', [])))} members:")
            for i, member in enumerate(result.get("members", [])[:10]):  # Show first 10
                props = member.get("properties", {})
                name = "Unknown"
                role = "Unknown"
                
                # Try to find name
                for prop_name, prop_value in props.items():
                    if "name" in prop_name.lower() or prop_name.lower() == "title":
                        if isinstance(prop_value, str):
                            name = prop_value
                        elif isinstance(prop_value, dict):
                            name = str(prop_value)
                        break
                
                # Try to find role
                for prop_name, prop_value in props.items():
                    if "role" in prop_name.lower():
                        if isinstance(prop_value, str):
                            role = prop_value
                        elif isinstance(prop_value, dict):
                            role = str(prop_value)
                        break
                
                print(f"  {i+1}. {name} - {role}")
            
            if len(result.get("members", [])) > 10:
                print(f"  ... and {len(result.get('members', [])) - 10} more")
        else:
            print(f"Success: {result.get('message', 'Operation completed')}")
    else:
        print(f"Error: {result.get('message', 'Operation failed')}")

if __name__ == "__main__":
    # If run as a script, provide interactive interface
    asyncio.run(run_member_search())