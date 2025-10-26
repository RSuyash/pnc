"""
Dashboard API endpoints for v1 - Common endpoints
"""
from fastapi import APIRouter, HTTPException, Depends, Query, status
from typing import Dict, Any, List, Optional
from datetime import datetime

from core.auth.dependencies import get_admin_user, get_current_user, require_role
from domain.models.member import Role
from application.services.member_data_service import member_data_service

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary")
async def get_dashboard_summary(current_user: dict = Depends(get_current_user)):
    """
    Get comprehensive dashboard summary for authenticated users
    Shows general statistics without sensitive member details
    """
    try:
        # Get member statistics using the new service
        stats = await member_data_service.get_member_statistics()
        
        # Calculate engagement metrics
        total_members = stats.get("total_members", 0)
        
        # Count active members
        active_members = 0
        for status_name, count in stats.get("statuses", {}).items():
            if "active" in status_name.lower():
                active_members += count
        
        summary = {
            "total_members": total_members,
            "active_members": active_members,
            "departments": len(stats.get("departments", {})),
            "roles": len(stats.get("roles", {})),
            "active_percentage": round((active_members / total_members * 100) if total_members > 0 else 0, 2),
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
    current_user: dict = Depends(get_current_user)
):
    """
    Search members by name (admin only for privacy)
    """
    try:
        # Only admins can search all members
        user_role = current_user.get("role")
        if user_role.value != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only administrators can search members"
            )
        
        matching_members = await member_data_service.search_members(query)
        
        return {
            "success": True,
            "members": matching_members,
            "count": len(matching_members)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching members: {str(e)}")


@router.get("/members/stats")
async def get_member_statistics(current_user: dict = Depends(get_current_user)):
    """
    Get comprehensive member statistics (admin only for privacy)
    """
    try:
        # Only admins can access detailed statistics
        user_role = current_user.get("role")
        if user_role.value != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only administrators can access member statistics"
            )
        
        stats = await member_data_service.get_member_statistics()
        
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
    current_user: dict = Depends(get_current_user)
):
    """
    Filter members by department, status, or year (admin only for privacy)
    """
    try:
        # Only admins can filter members
        user_role = current_user.get("role")
        if user_role.value != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only administrators can filter members"
            )
        
        # Start with all members and apply filters
        all_members = await member_data_service.get_all_members()
        
        filtered_members = []
        for member in all_members:
            include_member = True
            
            # Filter by department
            if department:
                member_dept = member.get("department", "")
                if str(member_dept).lower() != department.lower():
                    include_member = False
            
            # Filter by status
            if status and include_member:
                member_status = member.get("status", "")
                if str(member_status).lower() != status.lower():
                    include_member = False
            
            # Filter by year
            if year and include_member:
                member_year = member.get("year", "")
                if str(member_year).lower() != year.lower():
                    include_member = False
            
            if include_member:
                filtered_members.append(member)
        
        return {
            "success": True,
            "members": filtered_members,
            "count": len(filtered_members)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error filtering members: {str(e)}")


@router.get("/search-user-by-email")
async def search_user_by_email(
    email: str = Query(..., description="Email to search for"),
    current_user: dict = Depends(get_current_user)  # Any authenticated user can access
):
    """
    Search for a user by email in the Notion database
    Allows users to search for their own information or for admins to search for any user
    """
    print("=== SEARCH ENDPOINT CALLED ===")
    print(f"Search parameters - email: {email}")
    
    try:
        # Check if the user is searching for their own email or is an admin
        current_user_email = current_user.get("email")
        user_role = current_user.get("role")
        
        # Normalize emails for comparison
        normalized_search_email = email.strip().lower()
        normalized_user_email = current_user_email.strip().lower()
        
        # Log for debugging (remove in production)
        print(f"=== AUTHORIZATION DEBUG ===")
        print(f"Current user email: '{normalized_user_email}'")
        print(f"Current user role: {user_role.value}")
        print(f"Searching for email: '{normalized_search_email}'")
        print(f"Is admin: {user_role.value == 'admin'}")
        print(f"Is own data: {normalized_search_email == normalized_user_email}")
        
        # Security check: Regular users can only access their own data
        # Admins can access any user data
        is_admin = user_role.value == "admin"
        is_own_data = normalized_search_email == normalized_user_email
        
        print(f"Authorization decision - is_admin: {is_admin}, is_own_data: {is_own_data}")
        
        # If user is not admin and not searching for their own data, deny access
        if not is_admin and not is_own_data:
            print(f"ACCESS DENIED: User '{normalized_user_email}' cannot access '{normalized_search_email}'")
            print("=== END AUTHORIZATION DEBUG ===")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Users can only search for their own information"
            )
        
        print(f"ACCESS GRANTED: User '{normalized_user_email}' can access '{normalized_search_email}'")
        print("=== END AUTHORIZATION DEBUG ===")
        
        # Use the new member data service to search for the member
        member = await member_data_service.get_member_by_email(email)
        
        if member:
            print(f"Found user data for '{normalized_search_email}'")
            return {
                "success": True,
                "user": member
            }
        else:
            print(f"User not found: '{normalized_search_email}'")
            return {
                "success": True,
                "user": None,
                "message": "User not found"
            }
            
    except HTTPException:
        # Re-raise HTTP exceptions (like authentication errors)
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching user by email: {str(e)}")