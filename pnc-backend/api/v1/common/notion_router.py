"""
Notion API endpoints for v1 - Common endpoints
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any

from core.auth.dependencies import require_role, get_admin_user
from domain.models.member import Role
from infrastructure.external_apis.notion_service import notion_service


router = APIRouter(prefix="/notion", tags=["notion"])


@router.get("/test-connection")
async def test_notion_connection(current_user: dict = Depends(require_role(Role.ADMIN))):
    """Test the connection to Notion API"""
    try:
        result = await notion_service.test_connection()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Notion connection test failed: {str(e)}")


@router.get("/search-databases")
async def search_notion_databases(current_user: dict = Depends(require_role(Role.ADMIN))):
    """Search for all databases in Notion workspace"""
    try:
        result = await notion_service.search_databases()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to search databases: {str(e)}")


@router.get("/database/{database_id}/content")
async def get_database_content(
    database_id: str,
    current_user: dict = Depends(require_role(Role.ADMIN))
):
    """Get content from a specific Notion database"""
    try:
        result = await notion_service.get_database_content(database_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get database content: {str(e)}")


@router.get("/database/{database_id}/schema")
async def get_database_schema(
    database_id: str,
    current_user: dict = Depends(require_role(Role.ADMIN))
):
    """Get schema of a specific Notion database"""
    try:
        result = await notion_service.get_database_schema(database_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get database schema: {str(e)}")