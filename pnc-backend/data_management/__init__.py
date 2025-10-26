"""
Data Management module for PNC Backend API
Handles comprehensive data operations for members and other entities
"""
import asyncio
from typing import Dict, Any, List, Optional
from services.notion_service import notion_service


class DataManagementService:
    """Service class to handle comprehensive data operations"""

    def __init__(self):
        self.notion_service = notion_service

    async def find_members_database(self):
        """Find the members database in Notion"""
        db_result = await self.notion_service.search_databases()
        if not db_result["success"]:
            return None, "Failed to search databases"
        
        for db in db_result["databases"]:
            if "member" in db["title"].lower() or "team" in db["title"].lower():
                return db, None
        
        return None, "Members database not found"

    async def get_database_schema_with_property_mapping(self, database_id: str):
        """Get the database schema and create property mappings"""
        schema_result = await self.notion_service.get_database_schema(database_id)
        if not schema_result["success"]:
            return None, schema_result["message"]
        
        database_schema = schema_result["schema"]
        
        # Map the expected field names based on the schema
        field_mappings = {}
        for prop_name, prop_info in database_schema.items():
            lower_prop_name = prop_name.lower()
            if "name" in lower_prop_name or "full" in lower_prop_name:
                field_mappings["Full Name"] = prop_name
            elif "role" in lower_prop_name:
                field_mappings["Role"] = prop_name
            elif "department" in lower_prop_name:
                field_mappings["Department"] = prop_name
            elif "status" in lower_prop_name:
                field_mappings["Status"] = prop_name
            elif "year" in lower_prop_name:
                field_mappings["Year"] = prop_name
            elif "email" in lower_prop_name:
                field_mappings["Email"] = prop_name
        
        return {
            "schema": database_schema,
            "mappings": field_mappings
        }, None

    async def format_property_value(self, prop_name: str, prop_info: Dict, value: str):
        """Format a property value based on its type for Notion API"""
        prop_type = prop_info["type"]
        
        if prop_type == "title":
            return {"title": [{"text": {"content": str(value)}}]}
        elif prop_type == "rich_text":
            return {"rich_text": [{"text": {"content": str(value)}}]}
        elif prop_type == "select":
            # Check if the value exists in the available options
            options = [opt["name"] for opt in prop_info.get("select", {}).get("options", [])]
            if str(value) in options:
                return {"select": {"name": str(value)}}
            else:
                # Use first available option if value is not valid
                return {"select": {"name": options[0]}} if options else {"select": {"name": str(value)}}
        elif prop_type == "multi_select":
            # Check if the value exists in the available options
            options = [opt["name"] for opt in prop_info.get("multi_select", {}).get("options", [])]
            if str(value) in options:
                return {"multi_select": [{"name": str(value)}]}
            else:
                return {"multi_select": [{"name": options[0]}]} if options else {"multi_select": [{"name": str(value)}]}
        elif prop_type == "status":
            # Check if the value exists in the available status options
            options = [opt["name"] for opt in prop_info.get("status", {}).get("options", [])]
            if str(value) in options:
                return {"status": {"name": str(value)}}
            else:
                return {"status": {"name": options[0]}} if options else {"status": {"name": str(value)}}
        elif prop_type == "email":
            return {"email": str(value) if "@" in str(value) else ""}
        elif prop_type == "phone_number":
            return {"phone_number": str(value) if str(value).replace("-", "").replace(" ", "").isdigit() else ""}
        elif prop_type == "number":
            try:
                return {"number": float(value) if value else 0}
            except ValueError:
                return {"number": 0}
        elif prop_type == "checkbox":
            return {"checkbox": str(value).lower() in ['true', 'yes', '1', 'active']}
        elif prop_type == "date":
            # For now, skip date fields or use a default
            return None
        elif prop_type == "url":
            return {"url": str(value) if str(value).startswith("http") else ""}
        else:
            # Default to rich_text for unknown types
            return {"rich_text": [{"text": {"content": str(value)}}]}

    async def get_members_by_year(self, year: str) -> Dict[str, Any]:
        """Get all members for a specific year"""
        db, error = await self.find_members_database()
        if error:
            return {"success": False, "message": error}
        
        # Get all content and filter by year
        content_result = await self.notion_service.get_database_content(db["id"])
        if not content_result["success"]:
            return {"success": False, "message": content_result["message"]}
        
        # Find the year property
        schema_data, error = await self.get_database_schema_with_property_mapping(db["id"])
        if error:
            return {"success": False, "message": error}
        
        year_prop_name = schema_data["mappings"].get("Year")
        if not year_prop_name:
            return {"success": False, "message": "Year property not found in database"}
        
        # Filter members by year
        filtered_members = []
        for item in content_result["content"]:
            properties = item.get("properties", {})
            year_value = properties.get(year_prop_name, {}).get("select", {}).get("name")
            if year_value == year:
                filtered_members.append(item)
        
        return {
            "success": True,
            "members": filtered_members,
            "count": len(filtered_members)
        }

    async def get_members_by_status(self, status: str) -> Dict[str, Any]:
        """Get all members with a specific status"""
        db, error = await self.find_members_database()
        if error:
            return {"success": False, "message": error}
        
        # Get all content and filter by status
        content_result = await self.notion_service.get_database_content(db["id"])
        if not content_result["success"]:
            return {"success": False, "message": content_result["message"]}
        
        # Find the status property
        schema_data, error = await self.get_database_schema_with_property_mapping(db["id"])
        if error:
            return {"success": False, "message": error}
        
        status_prop_name = schema_data["mappings"].get("Status")
        if not status_prop_name:
            return {"success": False, "message": "Status property not found in database"}
        
        # Filter members by status
        filtered_members = []
        for item in content_result["content"]:
            properties = item.get("properties", {})
            status_value = properties.get(status_prop_name, {}).get("status", {}).get("name")
            if status_value == status:
                filtered_members.append(item)
        
        return {
            "success": True,
            "members": filtered_members,
            "count": len(filtered_members)
        }

    async def update_members_with_year_based_on_status(self) -> Dict[str, Any]:
        """Update all members to have the correct year based on their status"""
        db, error = await self.find_members_database()
        if error:
            return {"success": False, "message": error}
        
        # Get all members
        content_result = await self.notion_service.get_database_content(db["id"])
        if not content_result["success"]:
            return {"success": False, "message": content_result["message"]}
        
        # Get schema to find Year and Status properties
        schema_data, error = await self.get_database_schema_with_property_mapping(db["id"])
        if error:
            return {"success": False, "message": error}
        
        year_prop_name = schema_data["mappings"].get("Year")
        status_prop_name = schema_data["mappings"].get("Status")
        
        if not year_prop_name:
            return {"success": False, "message": "Year property not found in database"}
        if not status_prop_name:
            return {"success": False, "message": "Status property not found in database"}
        
        # Update each member based on their status
        updated_count = 0
        failed_updates = []
        
        for item in content_result["content"]:
            properties = item.get("properties", {})
            
            # Get current status
            current_status = properties.get(status_prop_name, {}).get("status", {}).get("name")
            
            # Determine the year based on status
            year_to_set = "24-25" if current_status == "Inactive" else "25-26" if current_status == "Active" else "25-26"
            
            # Format the year value according to its property type
            year_prop_info = schema_data["schema"][year_prop_name]
            year_property_update = await self.format_property_value(year_prop_name, year_prop_info, year_to_set)
            
            if year_property_update is None:
                failed_updates.append({
                    "page_id": item["id"],
                    "error": "Could not format year property value"
                })
                continue
            
            # Update the page
            update_result = await self.notion_service.update_database_entry(item["id"], {year_prop_name: year_property_update})
            
            if update_result["success"]:
                updated_count += 1
            else:
                failed_updates.append({
                    "page_id": item["id"],
                    "error": update_result["message"]
                })
        
        return {
            "success": True,
            "message": f"Updated {updated_count} members with year information",
            "updated_count": updated_count,
            "failed_count": len(failed_updates),
            "failed_updates": failed_updates
        }

    async def add_multiple_members(self, members_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Add multiple members to the database"""
        db, error = await self.find_members_database()
        if error:
            return {"success": False, "message": error}
        
        # Get schema for property mappings
        schema_data, error = await self.get_database_schema_with_property_mapping(db["id"])
        if error:
            return {"success": False, "message": error}
        
        database_schema = schema_data["schema"]
        
        results = []
        for member in members_data:
            # Create properties dictionary with the correct field names from the schema
            properties = {}
            
            # Add the known fields with correct property names from the schema
            for field_key, field_value in member.items():
                if field_key in schema_data["mappings"]:
                    prop_name = schema_data["mappings"][field_key]
                    prop_info = database_schema[prop_name]
                    
                    formatted_value = await self.format_property_value(prop_name, prop_info, field_value)
                    if formatted_value:
                        properties[prop_name] = formatted_value
            
            # Add any required properties that weren't filled yet
            for prop_name, prop_info in database_schema.items():
                if prop_name not in properties and prop_info.get("required", False):
                    # Set default values for required properties
                    if prop_info["type"] == "title":
                        properties[prop_name] = {"title": [{"text": {"content": "Default Name"}}]}
                    elif prop_info["type"] == "rich_text":
                        properties[prop_name] = {"rich_text": [{"text": {"content": ""}}]}
                    elif prop_info["type"] == "select" and prop_info.get("select", {}).get("options"):
                        properties[prop_name] = {"select": {"name": prop_info["select"]["options"][0]["name"]}}
                    elif prop_info["type"] == "email":
                        properties[prop_name] = {"email": ""}
                    elif prop_info["type"] == "phone_number":
                        properties[prop_name] = {"phone_number": ""}
                    elif prop_info["type"] == "number":
                        properties[prop_name] = {"number": 0}
                    elif prop_info["type"] == "checkbox":
                        properties[prop_name] = {"checkbox": False}
                    elif prop_info["type"] == "multi_select" and prop_info.get("multi_select", {}).get("options"):
                        properties[prop_name] = {"multi_select": [{"name": prop_info["multi_select"]["options"][0]["name"]}]}
                    elif prop_info["type"] == "status" and prop_info.get("status", {}).get("options"):
                        properties[prop_name] = {"status": {"name": prop_info["status"]["options"][0]["name"]}}
            
            # Create the entry
            result = await self.notion_service.create_database_entry(db["id"], properties)
            results.append({
                "member": member.get("Full Name", "Unknown"),
                "success": result["success"],
                "message": result["message"]
            })
        
        return {
            "success": True,
            "message": f"Attempted to add {len(members_data)} members",
            "results": results,
            "database_id": db["id"]
        }

    async def sync_members_data(self) -> Dict[str, Any]:
        """Sync members data between TypeScript and Notion database"""
        # This would be the function to sync the data
        # For now, return a placeholder implementation
        return {
            "success": True,
            "message": "Sync operation would compare and synchronize data between TypeScript and Notion",
            "operations": {
                "members_in_ts_not_in_notion": [],
                "members_in_notion_not_in_ts": []
            }
        }


# Create a singleton instance
data_management_service = DataManagementService()