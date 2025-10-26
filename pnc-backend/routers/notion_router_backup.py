from fastapi import APIRouter, HTTPException, Query
from typing import Optional, Dict, Any, List
from services.notion_service import notion_service
import json

router = APIRouter()

@router.get("/notion-health")
async def notion_backup_health_check():
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
        # Create properties matching the Notion database schema
        properties = {
            "Full Name": {
                "title": [
                    {
                        "text": {
                            "content": member["Full Name"]
                        }
                    }
                ]
            },
            "Role": {
                "rich_text": [
                    {
                        "text": {
                            "content": member["Role"]
                        }
                    }
                ]
            },
            "Department": {
                "select": {
                    "name": member["Department"]
                }
            },
            "Status": {
                "select": {
                    "name": member["Status"]
                }
            }
        }
        
        # Add any other required properties based on the database schema
        schema_result = await notion_service.get_database_schema(members_db["id"])
        if schema_result["success"]:
            schema = schema_result["schema"]
            # Check for any required fields that we haven't set
            for prop_name, prop_info in schema.items():
                if prop_name not in properties and prop_info.get("required", False):
                    # Set default values for required properties we don't have data for
                    if prop_info["type"] == "email":
                        properties[prop_name] = {"email": ""}
                    elif prop_info["type"] == "phone_number":
                        properties[prop_name] = {"phone_number": ""}
                    elif prop_info["type"] == "text" or prop_info["type"] == "rich_text":
                        properties[prop_name] = {"rich_text": [{"text": {"content": ""}}]}
                    elif prop_info["type"] == "number":
                        properties[prop_name] = {"number": 0}
                    elif prop_info["type"] == "checkbox":
                        properties[prop_name] = {"checkbox": False}
                    elif prop_info["type"] == "select" and "options" in prop_info and prop_info["options"]:
                        # Use the first option as default if available
                        properties[prop_name] = {"select": {"name": prop_info["options"][0]["name"]}}
                    elif prop_info["type"] == "multi_select" and "options" in prop_info and prop_info["options"]:
                        # Use the first option as default if available
                        properties[prop_name] = {"multi_select": [{"name": prop_info["options"][0]["name"]}]}

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
        "database_used": members_db["title"]
    }