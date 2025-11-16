"""
Script kiểm tra kết nối giữa Backend và Frontend
Kiểm tra xem backend có đang chạy và có thể truy cập được không
"""
import requests
import time
from typing import Dict, Any

# Backend URL
BACKEND_URL = "http://localhost:8000"

# Màu sắc cho terminal
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'

def print_status(message: str, status: str):
    """In trạng thái với màu sắc"""
    if status == "success":
        print(f"{GREEN}✓{RESET} {message}")
    elif status == "error":
        print(f"{RED}✗{RESET} {message}")
    elif status == "warning":
        print(f"{YELLOW}⚠{RESET} {message}")
    else:
        print(f"{BLUE}ℹ{RESET} {message}")

def test_endpoint(method: str, endpoint: str, data: Dict = None, description: str = "") -> bool:
    """Test một endpoint cụ thể"""
    url = f"{BACKEND_URL}{endpoint}"
    try:
        if method.upper() == "GET":
            response = requests.get(url, timeout=5)
        elif method.upper() == "POST":
            response = requests.post(url, json=data, timeout=5)
        else:
            print_status(f"Method {method} không được hỗ trợ", "error")
            return False
        
        if response.status_code == 200:
            print_status(f"{description}: {url}", "success")
            print(f"  Response: {response.json()}")
            return True
        else:
            print_status(f"{description}: {url} (HTTP {response.status_code})", "error")
            return False
            
    except requests.exceptions.ConnectionError:
        print_status(f"{description}: Không thể kết nối đến {url}", "error")
        return False
    except requests.exceptions.Timeout:
        print_status(f"{description}: Timeout khi kết nối đến {url}", "error")
        return False
    except Exception as e:
        print_status(f"{description}: Lỗi {str(e)}", "error")
        return False

def main():
    """Chạy tất cả các test"""
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}KIỂM TRA KẾT NỐI BACKEND - FRONTEND{RESET}")
    print(f"{BLUE}{'='*60}{RESET}\n")
    
    results = []
    
    # 1. Test root endpoint
    print(f"\n{YELLOW}[1] Test Root Endpoint{RESET}")
    results.append(test_endpoint("GET", "/", description="Root endpoint"))
    
    # 2. Test health check
    print(f"\n{YELLOW}[2] Test Health Check{RESET}")
    results.append(test_endpoint("GET", "/health", description="Health check endpoint"))
    
    # 3. Test NEO status
    print(f"\n{YELLOW}[3] Test NEO Blockchain Status{RESET}")
    results.append(test_endpoint("GET", "/api/neo/status", description="NEO status endpoint"))
    
    # 4. Test AI suggest tasks
    print(f"\n{YELLOW}[4] Test AI Task Suggestions{RESET}")
    suggest_data = {
        "userId": "test_user",
        "category": "all",
        "difficulty": "intermediate",
        "maxResults": 5
    }
    results.append(test_endpoint("POST", "/api/ai/suggest-tasks", data=suggest_data, description="AI suggest tasks"))
    
    # 5. Test AI generate missions
    print(f"\n{YELLOW}[5] Test AI Generate Missions{RESET}")
    mission_data = {
        "userId": "test_user",
        "preferences": {
            "categories": ["thể thao", "học tập"],
            "difficulty": "medium"
        }
    }
    results.append(test_endpoint("POST", "/api/ai/generate-missions", data=mission_data, description="AI generate missions"))
    
    # 6. Test mission count
    print(f"\n{YELLOW}[6] Test Mission Count{RESET}")
    results.append(test_endpoint("GET", "/api/missions/count", description="Mission count endpoint"))
    
    # Tổng kết
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}KẾT QUẢ KIỂM TRA{RESET}")
    print(f"{BLUE}{'='*60}{RESET}\n")
    
    total_tests = len(results)
    passed_tests = sum(results)
    failed_tests = total_tests - passed_tests
    
    print(f"Tổng số test: {total_tests}")
    print_status(f"Thành công: {passed_tests}/{total_tests}", "success" if passed_tests == total_tests else "warning")
    
    if failed_tests > 0:
        print_status(f"Thất bại: {failed_tests}/{total_tests}", "error")
    
    # Kết luận
    print(f"\n{BLUE}{'='*60}{RESET}")
    if passed_tests == total_tests:
        print_status("Backend đã sẵn sàng và có thể kết nối với Frontend!", "success")
    elif passed_tests > 0:
        print_status("Backend đang chạy nhưng một số endpoint có vấn đề", "warning")
        print_status("Hãy kiểm tra lại các endpoint bị lỗi", "warning")
    else:
        print_status("Backend không thể kết nối!", "error")
        print_status("Hãy đảm bảo backend đang chạy tại http://localhost:8000", "error")
        print_status("Chạy lệnh: python spoonos-backend/main.py", "info")
    print(f"{BLUE}{'='*60}{RESET}\n")
    
    return passed_tests == total_tests

if __name__ == "__main__":
    try:
        success = main()
        exit(0 if success else 1)
    except KeyboardInterrupt:
        print(f"\n\n{YELLOW}Test bị hủy bởi người dùng{RESET}")
        exit(1)
