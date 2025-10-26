import requests
import json

# Test the login functionality
def test_login():
    url = "http://localhost:8000/api/auth/login-json"
    
    # Use the admin credentials from the database
    login_data = {
        "email": "1332250296@mitwpu.edu.in",
        "password": "1234ABCD"
    }
    
    print("Testing login with credentials:")
    print(f"Email: {login_data['email']}")
    print(f"Password: {login_data['password']}")
    
    try:
        response = requests.post(url, json=login_data)
        print(f"Response Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("Login successful!")
            print(f"Access Token: {result.get('access_token', '')[:50]}...")
            print(f"User Info: {json.dumps(result.get('user', {}), indent=2)}")
        else:
            print(f"Login failed with status: {response.status_code}")
            print(f"Response: {response.text}")
        
    except Exception as e:
        print(f"Error during login test: {e}")

if __name__ == "__main__":
    test_login()