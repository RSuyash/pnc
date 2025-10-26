#!/usr/bin/env python3
"""
Simple test script to verify backend API endpoints are working
"""
import requests
import json

def test_backend_api():
    """Test the backend API endpoints"""
    base_url = "http://127.0.0.1:8000/api"
    
    print("Testing Backend API Endpoints")
    print("=" * 50)
    
    # Test 1: Health check
    print("\n1. Testing health check...")
    try:
        response = requests.get(f"{base_url}/health")
        print(f"   Health check: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"   Health check failed: {e}")
    
    # Test 2: Login
    print("\n2. Testing login...")
    try:
        login_data = {
            "email": "1332250296@mitwpu.edu.in",
            "password": "1234ABCD"
        }
        
        response = requests.post(f"{base_url}/auth/login-json", json=login_data)
        print(f"   Login: {response.status_code}")
        
        if response.status_code == 200:
            login_result = response.json()
            token = login_result.get("access_token")
            print(f"   Token: {token[:30]}..." if token else "No token")
            
            # Test 3: Auth me
            print("\n3. Testing auth me...")
            headers = {"Authorization": f"Bearer {token}"}
            response = requests.get(f"{base_url}/auth/me", headers=headers)
            print(f"   Auth me: {response.status_code}")
            
            if response.status_code == 200:
                user_data = response.json()
                print(f"   User: {user_data.get('full_name', 'Unknown')} ({user_data.get('role', 'Unknown')})")
                
                # Test 4: Dashboard summary
                print("\n4. Testing dashboard summary...")
                response = requests.get(f"{base_url}/dashboard/summary", headers=headers)
                print(f"   Dashboard summary: {response.status_code}")
                
                if response.status_code == 200:
                    summary_data = response.json()
                    print(f"   Summary: {summary_data}")
                else:
                    print(f"   Dashboard summary failed: {response.status_code}")
                    if response.status_code == 404:
                        print("   ERROR: Dashboard endpoint not found - backend may not be running with latest code")
                
                # Test 5: Search user by email
                print("\n5. Testing search user by email...")
                search_email = "1332250296@mitwpu.edu.in"
                response = requests.get(
                    f"{base_url}/dashboard/search-user-by-email?email={search_email}",
                    headers=headers
                )
                print(f"   Search user: {response.status_code}")
                
                if response.status_code == 200:
                    search_data = response.json()
                    print(f"   Search result: {search_data}")
                else:
                    print(f"   Search user failed: {response.status_code}")
                    if response.status_code == 404:
                        print("   ERROR: Search endpoint not found - backend may not be running with latest code")
            else:
                print(f"   Auth me failed: {response.status_code}")
        else:
            print(f"   Login failed: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"   Login test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_backend_api()