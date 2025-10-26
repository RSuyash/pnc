import os
from typing import Dict, List, Any, Optional
from notion_client import Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class NotionService:
    def __init__(self):
        self.token = os.getenv("NOTION_TOKEN", "")
        if not self.token:
            raise ValueError("NOTION_TOKEN environment variable is required")
        self.notion = Client(auth=self.token)

    async def test_connection(self) -> Dict[str, Any]:
        """Test the connection to the Notion API"""
        try:
            # Try to fetch users as a basic connection test
            users = self.notion.search(filter={"property": "object", "value": "user"})
            return {
                "success": True,
                "message": "Connection successful",
                "user_count": len(users.get("results", []))
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Connection failed: {str(e)}"
            }

    async def search_all_content(self) -> Dict[str, Any]:
        """Search for all content the integration can access"""
        try:
            # Search for all content
            all_content = self.notion.search(query="")
            
            databases = [obj for obj in all_content.get("results", []) if obj["object"] == "database"]
            pages = [obj for obj in all_content.get("results", []) if obj["object"] == "page"]
            
            return {
                "success": True,
                "databases": databases,
                "pages": pages,
                "total_objects": len(all_content.get("results", [])),
                "database_count": len(databases),
                "page_count": len(pages)
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Search failed: {str(e)}"
            }

    async def search_databases(self) -> Dict[str, Any]:
        """Search specifically for databases"""
        try:
            result = self.notion.search(filter={"property": "object", "value": "database"})
            
            databases_info = []
            for db in result.get("results", []):
                db_info = {
                    "id": db["id"],
                    "title": self._extract_title(db.get("title", [])),
                    "description": self._extract_title(db.get("description", [])),
                    "properties": db.get("properties", {}),
                    "created_time": db.get("created_time"),
                    "last_edited_time": db.get("last_edited_time")
                }
                databases_info.append(db_info)
            
            return {
                "success": True,
                "databases": databases_info,
                "count": len(databases_info)
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Database search failed: {str(e)}"
            }

    async def get_database_content(self, database_id: str, filter_query: Optional[Dict] = None, sorts: Optional[List[Dict]] = None) -> Dict[str, Any]:
        """Get content from a specific database"""
        try:
            query_params = {
                "database_id": database_id
            }
            
            if filter_query:
                query_params["filter"] = filter_query
            if sorts:
                query_params["sorts"] = sorts
                
            result = self.notion.databases.query(**query_params)
            
            # Process the results to make them more readable
            processed_results = []
            for item in result.get("results", []):
                processed_item = self._process_database_item(item)
                processed_results.append(processed_item)
            
            return {
                "success": True,
                "content": processed_results,
                "count": len(processed_results),
                "object_id": database_id
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Failed to get database content: {str(e)}"
            }

    async def get_database_schema(self, database_id: str) -> Dict[str, Any]:
        """Get the schema/structure of a specific database"""
        try:
            result = self.notion.databases.retrieve(database_id=database_id)
            
            return {
                "success": True,
                "schema": result.get("properties", {}),
                "title": self._extract_title(result.get("title", [])),
                "description": self._extract_title(result.get("description", [])),
                "created_time": result.get("created_time"),
                "last_edited_time": result.get("last_edited_time"),
                "object_id": database_id
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Failed to get database schema: {str(e)}"
            }

    async def search_pages(self) -> Dict[str, Any]:
        """Search specifically for pages"""
        try:
            result = self.notion.search(filter={"property": "object", "value": "page"})
            
            pages_info = []
            for page in result.get("results", []):
                page_info = {
                    "id": page["id"],
                    "title": self._extract_page_title(page),
                    "created_time": page.get("created_time"),
                    "last_edited_time": page.get("last_edited_time"),
                    "properties": page.get("properties", {})
                }
                pages_info.append(page_info)
            
            return {
                "success": True,
                "pages": pages_info,
                "count": len(pages_info)
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Page search failed: {str(e)}"
            }

    async def get_page_content(self, page_id: str) -> Dict[str, Any]:
        """Get content blocks from a specific page"""
        try:
            # Get page details
            page = self.notion.pages.retrieve(page_id=page_id)
            
            # Get child blocks (the actual content of the page)
            child_blocks = self.notion.blocks.children.list(block_id=page_id)
            
            return {
                "success": True,
                "page": page,
                "blocks": child_blocks.get("results", []),
                "object_id": page_id
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Failed to get page content: {str(e)}"
            }

    def _extract_title(self, title_array: List[Dict]) -> str:
        """Extract plain text title from Notion title array"""
        if not title_array:
            return "Untitled"
        return "".join([item.get("plain_text", "") for item in title_array])

    def _extract_page_title(self, page: Dict) -> str:
        """Extract title from a page object"""
        # Try different possible locations for the title
        if "properties" in page:
            # For database pages, title might be under a 'title' property
            for prop_name, prop_value in page["properties"].items():
                if prop_value.get("type") == "title":
                    return self._extract_title(prop_value.get("title", []))
        
        # For regular pages, try the title field
        if "title" in page:
            if isinstance(page["title"], str):
                return page["title"]
            elif isinstance(page["title"], list):
                return self._extract_title(page["title"])
        
        return "Untitled Page"

    def _process_database_item(self, item: Dict) -> Dict:
        """Process a database item to make it more readable"""
        processed = {
            "id": item["id"],
            "created_time": item.get("created_time"),
            "last_edited_time": item.get("last_edited_time"),
            "properties": {}
        }
        
        for prop_name, prop_value in item.get("properties", {}).items():
            processed["properties"][prop_name] = self._process_property(prop_value)
        
        return processed

    def _process_property(self, prop_value: Dict) -> Any:
        """Process a Notion property to extract readable values"""
        prop_type = prop_value.get("type")
        
        if prop_type == "title":
            return self._extract_title(prop_value.get("title", []))
        elif prop_type == "rich_text":
            return "".join([t.get("plain_text", "") for t in prop_value.get("rich_text", [])])
        elif prop_type == "text":
            return prop_value.get("content", "") if "content" in prop_value else ""
        elif prop_type == "number":
            return prop_value.get("number")
        elif prop_type == "select":
            return prop_value.get("select", {}).get("name") if prop_value.get("select") else None
        elif prop_type == "multi_select":
            return [opt.get("name") for opt in prop_value.get("multi_select", [])]
        elif prop_type == "date":
            date_obj = prop_value.get("date")
            if date_obj:
                return date_obj.get("start"), date_obj.get("end")
            return None
        elif prop_type == "people":
            return [person.get("name") for person in prop_value.get("people", [])]
        elif prop_type == "files":
            return [file_obj.get("name") for file_obj in prop_value.get("files", [])]
        elif prop_type == "checkbox":
            return prop_value.get("checkbox", False)
        elif prop_type == "url":
            return prop_value.get("url")
        elif prop_type == "email":
            return prop_value.get("email")
        elif prop_type == "phone_number":
            return prop_value.get("phone_number")
        elif prop_type == "formula":
            formula_result = prop_value.get("formula", {})
            if formula_result.get("type") == "number":
                return formula_result.get("number")
            elif formula_result.get("type") == "string":
                return formula_result.get("string")
            elif formula_result.get("type") == "boolean":
                return formula_result.get("boolean")
            elif formula_result.get("type") == "date":
                date_obj = formula_result.get("date")
                if date_obj:
                    return date_obj.get("start"), date_obj.get("end")
                return None
            return formula_result
        elif prop_type == "relation":
            return [rel.get("id") for rel in prop_value.get("relation", [])]
        elif prop_type == "rollup":
            rollup_result = prop_value.get("rollup", {})
            rollup_type = rollup_result.get("type")
            if rollup_type == "number":
                return rollup_result.get("number")
            elif rollup_type == "date":
                date_obj = rollup_result.get("date")
                if date_obj:
                    return date_obj.get("start"), date_obj.get("end")
                return None
            elif rollup_type == "array":
                return rollup_result.get("array", [])
            return rollup_result
        else:
            # For any other property types, return the full object for debugging
            return prop_value

    async def create_database_entry(self, database_id: str, properties: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new entry in a Notion database"""
        try:
            result = self.notion.pages.create(
                parent={"database_id": database_id},
                properties=properties
            )
            
            return {
                "success": True,
                "page_id": result["id"],
                "message": "Entry created successfully"
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Failed to create entry: {str(e)}"
            }

    async def update_database_entry(self, page_id: str, properties: Dict[str, Any]) -> Dict[str, Any]:
        """Update an existing entry in a Notion database"""
        try:
            result = self.notion.pages.update(
                page_id=page_id,
                properties=properties
            )
            
            return {
                "success": True,
                "page_id": result["id"],
                "message": "Entry updated successfully"
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Failed to update entry: {str(e)}"
            }

    async def delete_database_entry(self, page_id: str) -> Dict[str, Any]:
        """Delete an entry in a Notion database (moves to trash)"""
        try:
            result = self.notion.pages.update(
                page_id=page_id,
                archived=True  # Notion's way of "deleting" a page
            )
            
            return {
                "success": True,
                "page_id": result["id"],
                "message": "Entry moved to trash successfully"
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Failed to delete entry: {str(e)}"
            }

notion_service = NotionService()