"""
Dashboard API Endpoints for PNC Backend
Provides API endpoints for dashboard functionality accessible by the frontend
"""
from fastapi import APIRouter, HTTPException, Query, Depends
from typing import Dict, Any, List, Optional
from datetime import datetime
import json

# Import from existing backend modules
from models.auth import UserPublic, Role
from auth.dependencies import require_role
from services.notion_service import notion_service
from data_management import DataManagementService

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

# Initialize the data management service
data_service = DataManagementService()

@router.get("/summary")
async def get_dashboard_summary(current_user: UserPublic = Depends(require_role(Role.ADMIN))):
    """
    Get comprehensive dashboard summary for admins
    """
    try:
        # Get total members count
        db, error = await data_service.find_members_database()
        if error or db is None:
            total_members = 0
        else:
            all_members_result = await notion_service.get_database_content(db["id"])
            total_members = all_members_result.get("count", 0) if all_members_result["success"] else 0
        
        # Get active members - need to fix this call to not use private methods
        if db:
            content_result = await notion_service.get_database_content(db["id"])
            if content_result["success"]:
                active_count = 0
                for item in content_result["content"]:
                    properties = item.get("properties", {})
                    for prop_name, prop_value in properties.items():
                        if "status" in prop_name.lower():
                            status = None
                            if isinstance(prop_value, dict):
                                if "status" in prop_value and prop_value["status"]:
                                    status = prop_value["status"].get("name", "")
                                elif "select" in prop_value and prop_value["select"]:
                                    status = prop_value["select"].get("name", "")
                                elif "title" in prop_value:
                                    status = "".join([t.get("plain_text", "") for t in prop_value["title"]])
                                elif "rich_text" in prop_value:
                                    status = "".join([t.get("plain_text", "") for t in prop_value["rich_text"]])
                                else:
                                    status = str(prop_value)
                            else:
                                status = str(prop_value)
                            
                            if status and str(status).lower() in ["active", "active member"]:
                                active_count += 1
                            break
            else:
                active_count = 0
        else:
            active_count = 0
        
        # Get members with tasks
        tasks_result = await get_members_with_pending_tasks()
        members_with_tasks = tasks_result.get("count", 0) if tasks_result["success"] else 0
        
        summary = {
            "total_members": total_members,
            "active_members": active_count,
            "members_with_tasks": members_with_tasks,
            "active_percentage": round((active_count / total_members * 100) if total_members > 0 else 0, 2),
            "engagement_rate": round((members_with_tasks / active_count * 100) if active_count > 0 else 0, 2) if active_count > 0 else 0,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        return {
            "success": True,
            "summary": summary
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving dashboard summary: {str(e)}")


@router.get("/members/search")
async def search_members(
    query: str = Query(..., description="Search query for member names"),
    current_user: UserPublic = Depends(require_role(Role.ADMIN))
):
    """
    Search members by name
    """
    try:
        db, error = await data_service.find_members_database()
        if error:
            raise HTTPException(status_code=500, detail=error)
        
        # Get all members to search through
        content_result = await notion_service.get_database_content(db["id"])
        if not content_result["success"]:
            raise HTTPException(status_code=500, detail=content_result["message"])
        
        matching_members = []
        for item in content_result["content"]:
            properties = item.get("properties", {})
            
            # Look for name field in the properties
            member_name = None
            for prop_name, prop_value in properties.items():
                if "name" in prop_name.lower() or prop_name.lower() == "title":
                    # Process the property using the data service's method
                    if isinstance(prop_value, dict):
                        if "title" in prop_value:
                            member_name = "".join([t.get("plain_text", "") for t in prop_value["title"]])
                        elif "rich_text" in prop_value:
                            member_name = "".join([t.get("plain_text", "") for t in prop_value["rich_text"]])
                        elif "select" in prop_value and prop_value["select"]:
                            member_name = prop_value["select"].get("name", "")
                        elif "email" in prop_value:
                            member_name = prop_value["email"]
                        else:
                            # Fallback to getting any text content
                            member_name = str(prop_value)
                    else:
                        member_name = str(prop_value)
                    break
            
            if member_name and query.lower() in str(member_name).lower():
                # Process the member for frontend display
                processed_member = {
                    "id": item["id"],
                    "properties": {}
                }
                
                for prop_name, prop_value in properties.items():
                    # Process each property similar to how _process_property works
                    if isinstance(prop_value, dict):
                        if "title" in prop_value:
                            processed_member["properties"][prop_name] = "".join([t.get("plain_text", "") for t in prop_value["title"]])
                        elif "rich_text" in prop_value:
                            processed_member["properties"][prop_name] = "".join([t.get("plain_text", "") for t in prop_value["rich_text"]])
                        elif "select" in prop_value and prop_value["select"]:
                            processed_member["properties"][prop_name] = prop_value["select"].get("name", "")
                        elif "status" in prop_value and prop_value["status"]:
                            processed_member["properties"][prop_name] = prop_value["status"].get("name", "")
                        elif "email" in prop_value:
                            processed_member["properties"][prop_name] = prop_value["email"]
                        elif "number" in prop_value:
                            processed_member["properties"][prop_name] = prop_value["number"]
                        elif "url" in prop_value:
                            processed_member["properties"][prop_name] = prop_value["url"]
                        elif "phone_number" in prop_value:
                            processed_member["properties"][prop_name] = prop_value["phone_number"]
                        elif "checkbox" in prop_value:
                            processed_member["properties"][prop_name] = prop_value["checkbox"]
                        else:
                            processed_member["properties"][prop_name] = str(prop_value)
                    else:
                        processed_member["properties"][prop_name] = str(prop_value)
                
                matching_members.append(processed_member)
        
        return {
            "success": True,
            "members": matching_members,
            "count": len(matching_members)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching members: {str(e)}")


@router.get("/members/stats")
async def get_member_statistics(current_user: UserPublic = Depends(require_role(Role.ADMIN))):
    """
    Get comprehensive member statistics
    """
    try:
        db, error = await data_service.find_members_database()
        if error:
            raise HTTPException(status_code=500, detail=error)
        
        content_result = await notion_service.get_database_content(db["id"])
        if not content_result["success"]:
            raise HTTPException(status_code=500, detail=content_result["message"])
        
        stats = {
            "total_members": len(content_result["content"]),
            "departments": {},
            "statuses": {},
            "years": {},
            "roles": {}
        }
        
        for member in content_result["content"]:
            properties = member.get("properties", {})
            
            # Count by department
            for prop_name, prop_value in properties.items():
                if "department" in prop_name.lower():
                    dept = None
                    if isinstance(prop_value, dict):
                        if "select" in prop_value and prop_value["select"]:
                            dept = prop_value["select"].get("name", "")
                        elif "title" in prop_value:
                            dept = "".join([t.get("plain_text", "") for t in prop_value["title"]])
                        elif "rich_text" in prop_value:
                            dept = "".join([t.get("plain_text", "") for t in prop_value["rich_text"]])
                        else:
                            dept = str(prop_value)
                    else:
                        dept = str(prop_value)
                    
                    if dept:
                        stats["departments"][str(dept)] = stats["departments"].get(str(dept), 0) + 1
                        break
            
            # Count by status
            for prop_name, prop_value in properties.items():
                if "status" in prop_name.lower():
                    status = None
                    if isinstance(prop_value, dict):
                        if "status" in prop_value and prop_value["status"]:
                            status = prop_value["status"].get("name", "")
                        elif "select" in prop_value and prop_value["select"]:
                            status = prop_value["select"].get("name", "")
                        elif "title" in prop_value:
                            status = "".join([t.get("plain_text", "") for t in prop_value["title"]])
                        elif "rich_text" in prop_value:
                            status = "".join([t.get("plain_text", "") for t in prop_value["rich_text"]])
                        else:
                            status = str(prop_value)
                    else:
                        status = str(prop_value)
                    
                    if status:
                        stats["statuses"][str(status)] = stats["statuses"].get(str(status), 0) + 1
                        break
            
            # Count by year
            for prop_name, prop_value in properties.items():
                if "year" in prop_name.lower():
                    year = None
                    if isinstance(prop_value, dict):
                        if "select" in prop_value and prop_value["select"]:
                            year = prop_value["select"].get("name", "")
                        elif "title" in prop_value:
                            year = "".join([t.get("plain_text", "") for t in prop_value["title"]])
                        elif "rich_text" in prop_value:
                            year = "".join([t.get("plain_text", "") for t in prop_value["rich_text"]])
                        else:
                            year = str(prop_value)
                    else:
                        year = str(prop_value)
                    
                    if year:
                        stats["years"][str(year)] = stats["years"].get(str(year), 0) + 1
                        break
            
            # Count by role
            for prop_name, prop_value in properties.items():
                if "role" in prop_name.lower():
                    role = None
                    if isinstance(prop_value, dict):
                        if "select" in prop_value and prop_value["select"]:
                            role = prop_value["select"].get("name", "")
                        elif "title" in prop_value:
                            role = "".join([t.get("plain_text", "") for t in prop_value["title"]])
                        elif "rich_text" in prop_value:
                            role = "".join([t.get("plain_text", "") for t in prop_value["rich_text"]])
                        else:
                            role = str(prop_value)
                    else:
                        role = str(prop_value)
                    
                    if role:
                        stats["roles"][str(role)] = stats["roles"].get(str(role), 0) + 1
                        break
        
        return {
            "success": True,
            "statistics": stats
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting statistics: {str(e)}")


@router.get("/members/filter")
async def filter_members(
    department: Optional[str] = Query(None, description="Filter by department"),
    status: Optional[str] = Query(None, description="Filter by status"),
    year: Optional[str] = Query(None, description="Filter by year"),
    current_user: UserPublic = Depends(require_role(Role.ADMIN))
):
    """
    Filter members by department, status, or year
    """
    try:
        db, error = await data_service.find_members_database()
        if error:
            raise HTTPException(status_code=500, detail=error)
        
        content_result = await notion_service.get_database_content(db["id"])
        if not content_result["success"]:
            raise HTTPException(status_code=500, detail=content_result["message"])
        
        filtered_members = []
        for member in content_result["content"]:
            properties = member.get("properties", {})
            include_member = True
            
            # Filter by department
            if department:
                dept_found = False
                for prop_name, prop_value in properties.items():
                    if "department" in prop_name.lower():
                        dept = None
                        if isinstance(prop_value, dict):
                            if "select" in prop_value and prop_value["select"]:
                                dept = prop_value["select"].get("name", "")
                            elif "title" in prop_value:
                                dept = "".join([t.get("plain_text", "") for t in prop_value["title"]])
                            elif "rich_text" in prop_value:
                                dept = "".join([t.get("plain_text", "") for t in prop_value["rich_text"]])
                            else:
                                dept = str(prop_value)
                        else:
                            dept = str(prop_value)
                        
                        if str(dept) == department:
                            dept_found = True
                            break
                if not dept_found:
                    include_member = False
            
            # Filter by status
            if status and include_member:
                status_found = False
                for prop_name, prop_value in properties.items():
                    if "status" in prop_name.lower():
                        member_status = None
                        if isinstance(prop_value, dict):
                            if "status" in prop_value and prop_value["status"]:
                                member_status = prop_value["status"].get("name", "")
                            elif "select" in prop_value and prop_value["select"]:
                                member_status = prop_value["select"].get("name", "")
                            elif "title" in prop_value:
                                member_status = "".join([t.get("plain_text", "") for t in prop_value["title"]])
                            elif "rich_text" in prop_value:
                                member_status = "".join([t.get("plain_text", "") for t in prop_value["rich_text"]])
                            else:
                                member_status = str(prop_value)
                        else:
                            member_status = str(prop_value)
                        
                        if str(member_status) == status:
                            status_found = True
                            break
                if not status_found:
                    include_member = False
            
            # Filter by year
            if year and include_member:
                year_found = False
                for prop_name, prop_value in properties.items():
                    if "year" in prop_name.lower():
                        member_year = None
                        if isinstance(prop_value, dict):
                            if "select" in prop_value and prop_value["select"]:
                                member_year = prop_value["select"].get("name", "")
                            elif "title" in prop_value:
                                member_year = "".join([t.get("plain_text", "") for t in prop_value["title"]])
                            elif "rich_text" in prop_value:
                                member_year = "".join([t.get("plain_text", "") for t in prop_value["rich_text"]])
                            else:
                                member_year = str(prop_value)
                        else:
                            member_year = str(prop_value)
                        
                        if str(member_year) == year:
                            year_found = True
                            break
                if not year_found:
                    include_member = False
            
            if include_member:
                # Process the member for frontend display
                processed_member = {
                    "id": member["id"],
                    "properties": {}
                }
                
                for prop_name, prop_value in properties.items():
                    processed_member["properties"][prop_name] = data_service.notion_service._process_property(prop_value)
                
                filtered_members.append(processed_member)
        
        return {
            "success": True,
            "members": filtered_members,
            "count": len(filtered_members)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error filtering members: {str(e)}")


@router.get("/members/departments")
async def get_departments(current_user: UserPublic = Depends(require_role(Role.ADMIN))):
    """
    Get all unique departments
    """
    try:
        db, error = await data_service.find_members_database()
        if error:
            raise HTTPException(status_code=500, detail=error)
        
        content_result = await notion_service.get_database_content(db["id"])
        if not content_result["success"]:
            raise HTTPException(status_code=500, detail=content_result["message"])
        
        departments = set()
        for member in content_result["content"]:
            properties = member.get("properties", {})
            for prop_name, prop_value in properties.items():
                if "department" in prop_name.lower():
                    dept = None
                    if isinstance(prop_value, dict):
                        if "select" in prop_value and prop_value["select"]:
                            dept = prop_value["select"].get("name", "")
                        elif "title" in prop_value:
                            dept = "".join([t.get("plain_text", "") for t in prop_value["title"]])
                        elif "rich_text" in prop_value:
                            dept = "".join([t.get("plain_text", "") for t in prop_value["rich_text"]])
                        else:
                            dept = str(prop_value)
                    else:
                        dept = str(prop_value)
                    
                    if dept:
                        departments.add(str(dept))
                    break
        
        return {
            "success": True,
            "departments": list(departments)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting departments: {str(e)}")


@router.post("/members/bulk-update")
async def bulk_update_members(
    bulk_update_data: Dict[str, Any],
    current_user: UserPublic = Depends(require_role(Role.ADMIN))
):
    """
    Bulk update members based on filters
    """
    try:
        # Extract filter and update data
        filter_conditions = bulk_update_data.get("filter", {})
        updates = bulk_update_data.get("updates", {})
        
        # Get members matching the filter
        db, error = await data_service.find_members_database()
        if error:
            raise HTTPException(status_code=500, detail=error)
        
        content_result = await notion_service.get_database_content(db["id"])
        if not content_result["success"]:
            raise HTTPException(status_code=500, detail=content_result["message"])
        
        matching_members = []
        for member in content_result["content"]:
            properties = member.get("properties", {})
            include_member = True
            
            # Check filter conditions
            for filter_field, filter_value in filter_conditions.items():
                field_found = False
                for prop_name, prop_value in properties.items():
                    if filter_field.lower() in prop_name.lower():
                        field_found = True
                        current_value = data_service.notion_service._process_property(prop_value)
                        if str(current_value) != str(filter_value):
                            include_member = False
                        break
                
                if not field_found:
                    include_member = False
                if not include_member:
                    break
            
            if include_member:
                matching_members.append(member)
        
        # Prepare schema for updates
        schema_result = await notion_service.get_database_schema(db["id"])
        if not schema_result["success"]:
            raise HTTPException(status_code=500, detail=schema_result["message"])
        
        schema = schema_result["schema"]
        
        # Perform updates
        updated_count = 0
        failed_updates = []
        
        for member in matching_members:
            try:
                update_properties = {}
                
                # Format updates according to schema
                for update_field, update_value in updates.items():
                    for prop_name, prop_info in schema.items():
                        if update_field.lower() in prop_name.lower():
                            formatted_value = await data_service.format_property_value(
                                prop_name, prop_info, update_value
                            )
                            if formatted_value:
                                update_properties[prop_name] = formatted_value
                            break
                
                if update_properties:
                    update_result = await notion_service.update_database_entry(
                        member["id"], update_properties
                    )
                    
                    if update_result["success"]:
                        updated_count += 1
                    else:
                        failed_updates.append({
                            "member_id": member["id"],
                            "error": update_result["message"]
                        })
            except Exception as e:
                failed_updates.append({
                    "member_id": member["id"],
                    "error": str(e)
                })
        
        return {
            "success": True,
            "message": f"Updated {updated_count} members",
            "updated_count": updated_count,
            "failed_count": len(failed_updates),
            "failed_updates": failed_updates
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in bulk update: {str(e)}")


async def get_members_with_pending_tasks():
    """
    Helper function to get members with pending tasks (for internal use)
    """
    try:
        db, error = await data_service.find_members_database()
        if error:
            return {"success": False, "message": error}
        
        content_result = await notion_service.get_database_content(db["id"])
        if not content_result["success"]:
            return {"success": False, "message": content_result["message"]}
        
        members_with_tasks = []
        for member in content_result["content"]:
            properties = member.get("properties", {})
            
            # Look for Open Tasks or Active Projects fields
            has_tasks = False
            for prop_name, prop_value in properties.items():
                if "task" in prop_name.lower() or "project" in prop_name.lower():
                    task_value = None
                    if isinstance(prop_value, dict):
                        if "title" in prop_value:
                            task_value = "".join([t.get("plain_text", "") for t in prop_value["title"]])
                        elif "rich_text" in prop_value:
                            task_value = "".join([t.get("plain_text", "") for t in prop_value["rich_text"]])
                        elif "select" in prop_value and prop_value["select"]:
                            task_value = prop_value["select"].get("name", "")
                        elif "number" in prop_value:
                            task_value = prop_value["number"]
                        elif "url" in prop_value:
                            task_value = prop_value["url"]
                        else:
                            task_value = str(prop_value)
                    else:
                        task_value = str(prop_value)
                    
                    if task_value and str(task_value).strip() != "":
                        has_tasks = True
                        break
            
            if has_tasks:
                members_with_tasks.append(member)
        
        return {
            "success": True,
            "members": members_with_tasks,
            "count": len(members_with_tasks)
        }
    except Exception as e:
        return {"success": False, "message": f"Error getting members with tasks: {str(e)}"}