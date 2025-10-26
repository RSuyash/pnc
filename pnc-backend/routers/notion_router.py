from fastapi import APIRouter, HTTPException, Query
from typing import Optional, Dict, Any, List
from services.notion_service import notion_service
import json

router = APIRouter()

@router.get("/notion-health")
async def notion_health_check():
    """Health check endpoint to verify the service is running"""
    return {"status": "healthy", "service": "notion-integration"}

@router.get("/test-connection")
async def test_notion_connection():
    """Test the connection to the Notion API"""
    result = await notion_service.test_connection()
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["message"])
    return result

@router.get("/search-all")
async def search_all_content():
    """Search for all content the integration can access"""
    result = await notion_service.search_all_content()
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["message"])
    return result

@router.get("/databases")
async def get_databases():
    """Get all databases the integration can access"""
    result = await notion_service.search_databases()
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["message"])
    return result

@router.get("/databases/{database_id}")
async def get_database_content(
    database_id: str,
    filter_query: Optional[str] = Query(None, description="JSON string of filter query"),
    sorts: Optional[str] = Query(None, description="JSON string of sort parameters"),
    page_size: Optional[int] = Query(None, ge=1, le=100, description="Number of results per page")
):
    """Get content from a specific database"""
    import json
    
    # Parse filter and sort parameters if provided as JSON strings
    filter_obj = None
    sort_obj = None
    
    if filter_query:
        try:
            filter_obj = json.loads(filter_query)
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid filter_query JSON")
    
    if sorts:
        try:
            sort_obj = json.loads(sorts)
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid sorts JSON")
    
    result = await notion_service.get_database_content(database_id, filter_obj, sort_obj)
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["message"])
    
    # Apply page_size limit if specified
    if page_size and "content" in result:
        result["content"] = result["content"][:page_size]
        result["count"] = min(result["count"], page_size)
    
    return result

@router.get("/databases/{database_id}/schema")
async def get_database_schema(database_id: str):
    """Get the schema/structure of a specific database"""
    result = await notion_service.get_database_schema(database_id)
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["message"])
    return result

@router.get("/pages")
async def get_pages():
    """Get all pages the integration can access"""
    result = await notion_service.search_pages()
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["message"])
    return result

@router.get("/pages/{page_id}")
async def get_page_content(page_id: str):
    """Get content from a specific page"""
    result = await notion_service.get_page_content(page_id)
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["message"])
    return result

@router.get("/pnc-databases")
async def get_pnc_databases():
    """Get databases specifically relevant to PNC organization"""
    result = await notion_service.search_databases()
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["message"])
    
    # Filter for common PNC-related database names
    pnc_databases = []
    pnc_keywords = ["member", "project", "transaction", "account", "category", "event", "team", "finance", "budget"]
    
    for db in result["databases"]:
        db_title = db["title"].lower()
        if any(keyword in db_title for keyword in pnc_keywords):
            pnc_databases.append(db)
    
    return {
        "success": True,
        "databases": pnc_databases,
        "count": len(pnc_databases),
        "total_available": result["count"]
    }

@router.get("/pnc-database-content/{database_id}")
async def get_pnc_database_content(
    database_id: str,
    page_size: Optional[int] = Query(50, ge=1, le=100, description="Number of results per page"),
    page: Optional[int] = Query(1, ge=1, description="Page number")
):
    """Get content from a PNC database with pagination"""
    result = await notion_service.get_database_content(database_id)
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["message"])
    
    # Apply pagination
    all_content = result["content"]
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    paginated_content = all_content[start_idx:end_idx]
    
    return {
        "success": True,
        "content": paginated_content,
        "total_count": result["count"],
        "page": page,
        "page_size": page_size,
        "total_pages": (result["count"] + page_size - 1) // page_size,
        "has_more": end_idx < result["count"]
    }

@router.get("/search-databases")
async def search_databases_by_name(name: str = Query(..., min_length=1)):
    """Search databases by name"""
    result = await notion_service.search_databases()
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["message"])
    
    # Filter databases by name (case-insensitive)
    matching_databases = [
        db for db in result["databases"] 
        if name.lower() in db["title"].lower()
    ]
    
    return {
        "success": True,
        "databases": matching_databases,
        "count": len(matching_databases),
        "total_available": result["count"]
    }

@router.post("/databases/{database_id}/entries")
async def create_database_entry(database_id: str, properties: Dict[str, Any]):
    """Create a new entry in a Notion database"""
    result = await notion_service.create_database_entry(database_id, properties)
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["message"])
    return result

@router.patch("/pages/{page_id}")
async def update_database_entry(page_id: str, properties: Dict[str, Any]):
    """Update an existing entry in a Notion database"""
    result = await notion_service.update_database_entry(page_id, properties)
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["message"])
    return result

@router.delete("/pages/{page_id}")
async def delete_database_entry(page_id: str):
    """Delete an entry in a Notion database (moves to trash)"""
    result = await notion_service.delete_database_entry(page_id)
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["message"])
    return result

@router.get("/search-user-by-email")
async def search_user_by_email(email: str):
    """Search for a user in the members database by email address"""
    # First, get all databases to find the members database
    db_result = await notion_service.search_databases()
    if not db_result["success"]:
        raise HTTPException(status_code=500, detail="Failed to search databases")
    
    members_db = None
    for db in db_result["databases"]:
        if "member" in db["title"].lower() or "team" in db["title"].lower() or "directory" in db["title"].lower():
            members_db = db
            break
    
    if not members_db:
        raise HTTPException(status_code=404, detail="Members database not found")
    
    # Get all content from the members database
    content_result = await notion_service.get_database_content(members_db["id"])
    if not content_result["success"]:
        raise HTTPException(status_code=500, detail="Failed to get database content")
    
    # Search for user with matching email
    for item in content_result["content"]:
        properties = item.get("properties", {})
        
        # Look for email in the correct field names
        user_email = None
        for prop_name, prop_value in properties.items():
            # Check for common email field names
            if ("email" in prop_name.lower() or 
                "mail" in prop_name.lower() or 
                prop_name.lower() in ["student educational email", "personal email", "contact email"]):
                
                if isinstance(prop_value, str) and "@" in prop_value:
                    # Direct string value
                    user_email = prop_value
                elif isinstance(prop_value, dict):
                    # Processed property value
                    if "email" in prop_value:
                        user_email = prop_value["email"]
                    elif "rich_text" in prop_value and prop_value["rich_text"]:
                        # Extract email from rich text
                        rt_content = "".join([t.get("plain_text", "") for t in prop_value["rich_text"]])
                        if "@" in rt_content:
                            user_email = rt_content.strip()
                    elif "text" in prop_value and "content" in prop_value["text"]:
                        # Direct text content
                        text_content = prop_value["text"]["content"]
                        if "@" in text_content:
                            user_email = text_content.strip()
                
                # If we found an email, stop searching properties
                if user_email:
                    break
        
        # Check if this is our target user
        if user_email and user_email.lower() == email.lower():
            # Extract all relevant user information
            user_data = {
                "id": item["id"],
                "email": user_email,
                "name": "",
                "role": "",
                "department": "",
                "status": "",
                "year": ""
            }
            
            # Extract other fields
            for prop_name, prop_value in properties.items():
                prop_lower = prop_name.lower()
                
                # Name extraction
                if "name" in prop_lower or prop_name == "title":
                    if isinstance(prop_value, str):
                        user_data["name"] = prop_value
                    elif isinstance(prop_value, dict):
                        if "title" in prop_value:
                            user_data["name"] = "".join([t.get("plain_text", "") for t in prop_value["title"]])
                        elif "rich_text" in prop_value:
                            user_data["name"] = "".join([t.get("plain_text", "") for t in prop_value["rich_text"]])
                        elif "text" in prop_value and "content" in prop_value["text"]:
                            user_data["name"] = prop_value["text"]["content"]
                
                # Role extraction
                elif "role" in prop_lower:
                    if isinstance(prop_value, str):
                        user_data["role"] = prop_value
                    elif isinstance(prop_value, dict) and "select" in prop_value and prop_value["select"]:
                        user_data["role"] = prop_value["select"].get("name", "")
                
                # Department extraction
                elif "department" in prop_lower:
                    if isinstance(prop_value, str):
                        user_data["department"] = prop_value
                    elif isinstance(prop_value, dict) and "select" in prop_value and prop_value["select"]:
                        user_data["department"] = prop_value["select"].get("name", "")
                
                # Status extraction
                elif "status" in prop_lower:
                    if isinstance(prop_value, str):
                        user_data["status"] = prop_value
                    elif isinstance(prop_value, dict) and "status" in prop_value and prop_value["status"]:
                        user_data["status"] = prop_value["status"].get("name", "")
                
                # Year extraction
                elif "year" in prop_lower:
                    if isinstance(prop_value, str):
                        user_data["year"] = prop_value
                    elif isinstance(prop_value, dict) and "select" in prop_value and prop_value["select"]:
                        user_data["year"] = prop_value["select"].get("name", "")
            
            # Look for image/photograph fields
            for prop_name, prop_value in properties.items():
                prop_lower = prop_name.lower()
                if any(img_field in prop_lower for img_field in ["photo", "photograph", "image", "picture", "avatar", "profile picture"]):
                    if isinstance(prop_value, str):
                        user_data["image"] = prop_value
                    elif isinstance(prop_value, dict) and ("url" in prop_value or "files" in prop_value):
                        if "url" in prop_value and prop_value["url"]:
                            user_data["image"] = prop_value["url"]
                        elif "files" in prop_value and prop_value["files"]:
                            # Get the first available file URL
                            first_file = prop_value["files"][0]
                            if isinstance(first_file, dict) and "file" in first_file and "url" in first_file["file"]:
                                user_data["image"] = first_file["file"]["url"]
                            elif isinstance(first_file, dict) and "url" in first_file:
                                user_data["image"] = first_file["url"]
                    break  # Only take the first image found
            
            return {
                "success": True,
                "user": user_data,
                "database_id": members_db["id"],
                "database_name": members_db["title"]
            }
    
    # User not found
    return {
        "success": True,
        "user": None,
        "message": "User not found in database"
    }


@router.post("/add-missing-members")
async def add_missing_members():
    """Add the missing members from TypeScript to Notion database"""
    # First, get all databases to find the members database
    db_result = await notion_service.search_databases()
    if not db_result["success"]:
        raise HTTPException(status_code=500, detail="Failed to search databases")
    
    members_db = None
    for db in db_result["databases"]:
        if "member" in db["title"].lower() or "team" in db["title"].lower():
            members_db = db
            break
    
    if not members_db:
        raise HTTPException(status_code=404, detail="Members database not found")
    
    # Get the schema of the members database to know the exact property names and types
    schema_result = await notion_service.get_database_schema(members_db["id"])
    if not schema_result["success"]:
        raise HTTPException(status_code=500, detail="Failed to get database schema")
    
    database_schema = schema_result["schema"]
    
    # Map the expected field names based on the schema (case-insensitive)
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

    # The missing members based on our comparison
    missing_members = [
        {"Full Name": "Krishnandu Sarkar", "Role": "Research Head", "Department": "Research", "Status": "Inactive"},
        {"Full Name": "Priya Kadam", "Role": "Vice - President", "Department": "Executive", "Status": "Inactive"},
        {"Full Name": "Jui Dicholkar", "Role": "Media Head", "Department": "Media", "Status": "Inactive"},
        {"Full Name": "Parth Borkar", "Role": "Treasurer", "Department": "Executive", "Status": "Inactive"},
        {"Full Name": "Saartha Kamble", "Role": "Secretary", "Department": "Executive", "Status": "Inactive"},
    ]
    
    results = []
    for member in missing_members:
        # Get the schema of the members database to know the exact property names and types
        schema_result = await notion_service.get_database_schema(members_db["id"])
        if not schema_result["success"]:
            results.append({
                "member": member["Full Name"],
                "success": False,
                "message": "Failed to get database schema"
            })
            continue
        
        database_schema = schema_result["schema"]
        
        # Map the expected field names based on the schema (case-insensitive)
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

        # Create properties dictionary with the correct field names from the schema
        properties = {}
        
        # Add the known fields with correct property names from the schema
        for field_key, field_value in member.items():
            if field_key in field_mappings:
                prop_name = field_mappings[field_key]
                prop_info = database_schema[prop_name]
                
                # Format the value according to the property type
                if prop_info["type"] == "title":
                    properties[prop_name] = {
                        "title": [{"text": {"content": field_value}}]
                    }
                elif prop_info["type"] == "rich_text":
                    properties[prop_name] = {
                        "rich_text": [{"text": {"content": field_value}}]
                    }
                elif prop_info["type"] == "select":
                    # Check if the value exists in the available options
                    options = [opt["name"] for opt in prop_info.get("options", [])]
                    if field_value in options:
                        properties[prop_name] = {"select": {"name": field_value}}
                    else:
                        # Use first available option or create a default
                        if options:
                            properties[prop_name] = {"select": {"name": options[0]}}
                        else:
                            properties[prop_name] = {"select": {"name": field_value}}
                elif prop_info["type"] == "multi_select":
                    # Check if the value exists in the available options
                    options = [opt["name"] for opt in prop_info.get("options", [])]
                    if field_value in options:
                        properties[prop_name] = {"multi_select": [{"name": field_value}]}
                    else:
                        # Use first available option or create a default
                        if options:
                            properties[prop_name] = {"multi_select": [{"name": options[0]}]}
                        else:
                            properties[prop_name] = {"multi_select": [{"name": field_value}]}
                elif prop_info["type"] == "email":
                    properties[prop_name] = {"email": field_value if "@" in field_value else ""}
                elif prop_info["type"] == "phone_number":
                    properties[prop_name] = {"phone_number": field_value if field_value.replace("-", "").replace(" ", "").isdigit() else ""}
                elif prop_info["type"] == "number":
                    try:
                        properties[prop_name] = {"number": float(field_value) if field_value else 0}
                    except ValueError:
                        properties[prop_name] = {"number": 0}
                elif prop_info["type"] == "checkbox":
                    properties[prop_name] = {"checkbox": field_value.lower() in ['true', 'yes', '1', 'active'] if isinstance(field_value, str) else bool(field_value)}
                elif prop_info["type"] == "date":
                    # For now, skip date fields or use a default
                    # This would need proper date parsing if required
                    pass
                elif prop_info["type"] == "url":
                    properties[prop_name] = {"url": field_value if field_value.startswith("http") else ""}
                else:
                    # Default to rich_text for unknown types
                    properties[prop_name] = {
                        "rich_text": [{"text": {"content": str(field_value)}}]
                    }
        
        # Add any required properties that weren't filled yet
        for prop_name, prop_info in database_schema.items():
            if prop_name not in properties and prop_info.get("required", False):
                # Set default values for required properties
                if prop_info["type"] == "title":
                    properties[prop_name] = {"title": [{"text": {"content": "Default"}}]}
                elif prop_info["type"] == "rich_text":
                    properties[prop_name] = {"rich_text": [{"text": {"content": ""}}]}
                elif prop_info["type"] == "select" and prop_info.get("options"):
                    properties[prop_name] = {"select": {"name": prop_info["options"][0]["name"]}}
                elif prop_info["type"] == "email":
                    properties[prop_name] = {"email": ""}
                elif prop_info["type"] == "phone_number":
                    properties[prop_name] = {"phone_number": ""}
                elif prop_info["type"] == "number":
                    properties[prop_name] = {"number": 0}
                elif prop_info["type"] == "checkbox":
                    properties[prop_name] = {"checkbox": False}
                elif prop_info["type"] == "multi_select" and prop_info.get("options"):
                    properties[prop_name] = {"multi_select": [{"name": prop_info["options"][0]["name"]}]}
                elif prop_info["type"] == "url":
                    properties[prop_name] = {"url": ""}
                # Other types would need specific handling if required

        result = await notion_service.create_database_entry(members_db["id"], properties)
        results.append({
            "member": member["Full Name"],
            "success": result["success"],
            "message": result["message"]
        })
    
    return {
        "success": True,
        "message": f"Attempted to add {len(missing_members)} missing members to Notion database",
        "results": results,
        "database_used": members_db["title"],
        "database_id": members_db["id"]
    }