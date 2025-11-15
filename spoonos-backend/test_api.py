"""
Test script for backend API endpoints
"""
import requests
import json

API_BASE = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("\n=== Testing Health Endpoint ===")
    response = requests.get(f"{API_BASE}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
def test_neo_status():
    """Test NEO status endpoint"""
    print("\n=== Testing NEO Status Endpoint ===")
    response = requests.get(f"{API_BASE}/api/neo/status")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
def test_create_mission():
    """Test create mission endpoint"""
    print("\n=== Testing Create Mission Endpoint ===")
    
    mission_data = {
        "creator": "NWWkFU3dKWTHNpxjz8MRgt5eKe1Ld834xQ",
        "title": "Test Mission: Complete 30 min workout",
        "description": "Complete a 30-minute workout and submit proof",
        "reward_amount": 10,
        "deadline": 86400,  # 1 day
        "category": "fitness"
    }
    
    response = requests.post(
        f"{API_BASE}/api/neo/create-mission",
        json=mission_data
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    return response.json().get("missionId") if response.status_code == 200 else None

def test_get_mission(mission_id: int):
    """Test get mission endpoint"""
    print(f"\n=== Testing Get Mission {mission_id} ===")
    response = requests.get(f"{API_BASE}/api/missions/{mission_id}")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

def test_mission_count():
    """Test mission count endpoint"""
    print("\n=== Testing Mission Count Endpoint ===")
    response = requests.get(f"{API_BASE}/api/missions/count")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

if __name__ == "__main__":
    try:
        test_health()
        test_neo_status()
        mission_id = test_create_mission()
        
        if mission_id:
            test_get_mission(mission_id)
        
        test_mission_count()
        
        print("\n✅ All tests completed!")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
