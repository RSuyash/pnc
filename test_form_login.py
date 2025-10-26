import requests
from requests_toolbelt.multipart.encoder import MultipartEncoder

# Test the OAuth2 form login functionality (the one used by frontend)
def test_form_login():
    url = "http://localhost:8000/api/auth/login"
    
    # Use the admin credentials from the database
    login_data = {
        "username": "1332250296@mitwpu.edu.in",
        "password": "1234ABCD"
    }
    
    print("Testing form login with credentials:")
    print(f"Username: {login_data['username']}")
    print(f"Password: {login_data['password']}")
    
    try:
        # For OAuth2 form data, we need to send as form parameters, not JSON
        response = requests.post(url, data=login_data)
        print(f"Response Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("Form login successful!")
            print(f"Access Token: {result.get('access_token', '')[:50]}...")
            print(f"Token Type: {result.get('token_type', '')}")
            print(f"User Info: {result.get('user', {})}")
        else:
            print(f"Form login failed with status: {response.status_code}")
            print(f"Response: {response.text}")
        
    except Exception as e:
        print(f"Error during form login test: {e}")

if __name__ == "__main__":
    test_form_login()