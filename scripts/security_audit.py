import requests
import time

BASE_URL = "http://localhost:8000"
PREFIX = "/api/v1"

def get_auth_token():
    try:
        # Using the actual mock user: researcher/securepassword123
        resp = requests.post(f"{BASE_URL}{PREFIX}/auth/login", data={"username": "researcher", "password": "securepassword123"})
        if resp.status_code == 200:
            return resp.json()["access_token"]
        else:
            print(f"Login failed: Status {resp.status_code}, Response: {resp.text}")
    except Exception as e:
        print(f"Auth error: {e}")
    return None

def test_rate_limiting():
    print("Testing rate limiting on /auth/login...")
    for i in range(10):
        try:
            resp = requests.post(f"{BASE_URL}{PREFIX}/auth/login", data={"username": "admin", "password": "password"})
            if resp.status_code == 429:
                print(f"Rate limiting triggered at request {i+1}")
                return True
        except Exception as e:
            pass
    print("WARNING: Rate limiting NOT triggered after 10 requests")
    return False

def test_phi_scrubbing_baseline(token):
    print("\nVerifying PHI scrubbing baseline...")
    if not token:
        print("Skipping PHI test: No auth token obtained.")
        return False
        
    patient_data = {
        "age": 30,
        "condition": "Healthy",
        "scan_type": "Retinal",
        "metadata": {}
    }
    headers = {"Authorization": f"Bearer {token}"}
    try:
        resp = requests.post(f"{BASE_URL}{PREFIX}/generate?count=10", json=patient_data, headers=headers)
        if resp.status_code == 200:
            data = resp.text
            sensitive_patterns = ["SSN", "social security", "Phone:"]
            found = [p for p in sensitive_patterns if p in data]
            if not found:
                print("No sensitive patterns found in synthetic payload.")
                return True
            else:
                print(f"DANGER: Sensitive patterns detected: {found}")
        else:
            print(f"PHI test could not run: Status {resp.status_code}")
    except Exception as e:
        print(f"PHI test error: {e}")
    return False

if __name__ == "__main__":
    print("--- MedSynth Security Audit ---")
    token = get_auth_token()
    phi_pass = test_phi_scrubbing_baseline(token)
    rate_limit_pass = test_rate_limiting()
    
    if rate_limit_pass and phi_pass:
        print("\nSUMMARY: Security baseline tests PASSED")
    else:
        print("\nSUMMARY: Security baseline tests FAILED")
