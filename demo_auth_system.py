"""
Demo script for PNC Authentication System
"""
import requests
import json


class PNCAuthAPI:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.access_token = None
        self.headers = {"Content-Type": "application/json"}
    
    def register_user(self, email, full_name, password, role="member"):
        """Register a new user"""
        data = {
            "email": email,
            "full_name": full_name,
            "password": password,
            "confirm_password": password,
            "role": role
        }
        response = requests.post(f"{self.base_url}/api/auth/register", json=data, headers=self.headers)
        return response.json()
    
    def login_user(self, email, password):
        """Login user with email and password (using OAuth2 form)"""
        # Using requests for OAuth2 password flow
        login_data = {
            "username": email,
            "password": password
        }
        response = requests.post(
            f"{self.base_url}/api/auth/login",
            data=login_data  # Not JSON, form data for OAuth2
        )
        if response.status_code == 200:
            result = response.json()
            self.access_token = result["access_token"]
            self.headers["Authorization"] = f"Bearer {self.access_token}"
            return result
        return response.json()
    
    def login_user_extended(self, email, password, remember_me=False):
        """Login using extended login endpoint"""
        data = {
            "email": email,
            "password": password,
            "remember_me": remember_me
        }
        response = requests.post(f"{self.base_url}/api/auth/login-extended", json=data, headers=self.headers)
        result = response.json()
        if response.status_code == 200:
            self.access_token = result["access_token"]
            self.headers["Authorization"] = f"Bearer {self.access_token}"
        return result
    
    def get_profile(self):
        """Get current user's profile"""
        response = requests.get(f"{self.base_url}/api/auth/me", headers=self.headers)
        return response.json()
    
    def update_profile(self, **updates):
        """Update current user's profile"""
        response = requests.put(f"{self.base_url}/api/auth/me", json=updates, headers=self.headers)
        return response.json()
    
    def change_password(self, current_password, new_password):
        """Change current user's password"""
        data = {
            "current_password": current_password,
            "new_password": new_password,
            "confirm_new_password": new_password
        }
        response = requests.put(f"{self.base_url}/api/auth/me/change-password", json=data, headers=self.headers)
        return response.json()
    
    def list_users(self):
        """List all users (admin only)"""
        response = requests.get(f"{self.base_url}/api/auth/users", headers=self.headers)
        return response.json()
    
    def get_user(self, user_id):
        """Get specific user by ID (admin only)"""
        response = requests.get(f"{self.base_url}/api/auth/users/{user_id}", headers=self.headers)
        return response.json()
    
    def update_user(self, user_id, **updates):
        """Update user by ID (admin only)"""
        response = requests.put(f"{self.base_url}/api/auth/users/{user_id}", json=updates, headers=self.headers)
        return response.json()
    
    def delete_user(self, user_id):
        """Delete user by ID (admin only)"""
        response = requests.delete(f"{self.base_url}/api/auth/users/{user_id}", headers=self.headers)
        return response.json()


def main():
    print("PNC Authentication System Demo")
    print("=" * 50)
    
    api = PNCAuthAPI()
    
    print("\n1. Testing API health:")
    try:
        health_response = requests.get(f"{api.base_url}/api/health")
        print(f"   API Health: {health_response.json()}")
    except Exception as e:
        print(f"   API not running: {e}")
        print("   Please start the backend server with: uvicorn main:app --reload")
        return
    
    print("\n2. Registering a new user:")
    register_result = api.register_user(
        email="test@example.com", 
        full_name="Test User",
        password="securepassword123"
    )
    print(f"   Registration result: {json.dumps(register_result, indent=2)}")
    
    print("\n3. Logging in with registered user:")
    login_result = api.login_user("test@example.com", "securepassword123")
    print(f"   Login result: {json.dumps(login_result, indent=2)[:200]}...")
    
    print("\n4. Getting user profile:")
    profile = api.get_profile()
    print(f"   Profile: {json.dumps(profile, indent=2)[:200]}...")
    
    print("\n5. Updating user profile:")
    update_result = api.update_profile(department="Research", year="25-26")
    print(f"   Update result: {json.dumps(update_result, indent=2)[:200]}...")
    
    print("\n6. Testing admin access (with default admin):")
    # Login as admin
    admin_login = api.login_user("admin@pnclub.org", "admin123")
    print(f"   Admin login: {'Success' if api.access_token else 'Failed'}")
    
    if api.access_token:
        print("\n7. Listing all users (admin only):")
        users = api.list_users()
        print(f"   Users count: {len(users.get('detail', [])) if isinstance(users, dict) and 'detail' in users else 'Error'}")
    
    print("\n" + "=" * 50)
    print("Authentication System Features:")
    print("✓ User Registration with role assignment")
    print("✓ Secure Login with JWT tokens")
    print("✓ Profile Management")
    print("✓ Password Change")
    print("✓ Role-based Access Control (Admin, Moderator, Member, Guest)")
    print("✓ Protected Endpoints with proper authorization")
    print("✓ User Management by Admins")
    print("✓ Token-based Authentication")
    print("=" * 50)
    
    print("\nNext Steps for Frontend Integration:")
    print("1. Use /api/auth/register for user registration")
    print("2. Use /api/auth/login for authentication")
    print("3. Include 'Authorization: Bearer <token>' header for protected endpoints")
    print("4. Store tokens securely (localStorage/sessionStorage with security considerations)")
    print("5. Handle token expiration and refresh")
    print("6. Implement role-based UI components")


if __name__ == "__main__":
    main()