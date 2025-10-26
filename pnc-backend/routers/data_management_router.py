"""
Data Management Router for PNC Backend API
Handles comprehensive data operations for members and other entities
"""
from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any, List
from data_management import data_management_service

router = APIRouter(prefix="/data", tags=["data-management"])


@router.get("/members/year/{year}")
async def get_members_by_year(year: str):
    """Get all members for a specific year"""
    result = await data_management_service.get_members_by_year(year)
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["message"])
    return result


@router.get("/members/status/{status}")
async def get_members_by_status(status: str):
    """Get all members with a specific status"""
    result = await data_management_service.get_members_by_status(status)
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["message"])
    return result


@router.post("/members/sync-year-from-status")
async def sync_members_year_based_on_status():
    """Update all members to have the correct year based on their status"""
    result = await data_management_service.update_members_with_year_based_on_status()
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["message"])
    return result


@router.post("/members/batch-add")
async def add_multiple_members(members_data: List[Dict[str, Any]]):
    """Add multiple members to the database"""
    result = await data_management_service.add_multiple_members(members_data)
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["message"])
    return result


@router.post("/members/sync")
async def sync_members_data():
    """Sync members data between TypeScript and Notion database"""
    result = await data_management_service.sync_members_data()
    if not result["success"]:
        raise HTTPException(status_code=500, detail=result["message"])
    return result


@router.get("/data-health")
async def data_management_health():
    """Health check for the data management service"""
    return {"status": "healthy", "service": "data-management"}