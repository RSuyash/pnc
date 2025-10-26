#!/usr/bin/env python3
"""
Test script to verify the new dashboard API endpoints are working correctly
"""
import asyncio
import aiohttp
import json

async def test_dashboard_endpoints():
    """Test the new dashboard API endpoints"""
    base_url = "http://localhost:8000"
    
    # Test credentials (the admin user we know exists)
    test_email = "1332250296@mitwpu.edu.in"
    test_password = "1234ABCD"
    
    async with aiohttp.ClientSession() as session:
        print("Testing Dashboard API Endpoints")
        print("=" * 50)
        
        # Step 1: Login to get authentication token
        print("\n1. Testing login...")
        login_data = {
            "username": test_email,
            "password": test_password
        }
        
        try:
            async with session.post(f"{base_url}/api/auth/login", data=login_data) as resp:
                if resp.status == 200:
                    login_result = await resp.json()
                    auth_token = login_result.get("access_token")
                    print(f"✅ Login successful. Token: {auth_token[:20]}..." if auth_token else "No token")
                else:
                    print(f"❌ Login failed with status: {resp.status}")
                    return
        except Exception as e:
            print(f"❌ Login error: {e}")
            return
            
        # Step 2: Test dashboard summary endpoint
        print("\n2. Testing dashboard summary...")
        headers = {"Authorization": f"Bearer {auth_token}"}
        
        try:
            async with session.get(f"{base_url}/api/dashboard/summary", headers=headers) as resp:
                if resp.status == 200:
                    summary_result = await resp.json()
                    print(f"✅ Dashboard summary: {summary_result}")
                else:
                    print(f"❌ Dashboard summary failed with status: {resp.status}")
        except Exception as e:
            print(f"❌ Dashboard summary error: {e}")
            
        # Step 3: Test search user by email endpoint
        print("\n3. Testing search user by email...")
        
        try:
            search_url = f"{base_url}/api/dashboard/search-user-by-email?email={test_email}"
            async with session.get(search_url, headers=headers) as resp:
                if resp.status == 200:
                    search_result = await resp.json()
                    print(f"✅ Search result: {search_result}")
                else:
                    print(f"❌ Search failed with status: {resp.status}")
                    # Get error details
                    error_text = await resp.text()
                    print(f"Error details: {error_text}")
        except Exception as e:
            print(f"❌ Search error: {e}")

if __name__ == "__main__":
    asyncio.run(test_dashboard_endpoints())