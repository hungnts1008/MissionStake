"""
Test Gemini API endpoints qua Backend
"""
import requests
import json

BACKEND_URL = "http://localhost:8000"

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

def test_verify_evidence():
    """Test endpoint xác minh bằng chứng"""
    print(f"\n{YELLOW}[1] Test Verify Evidence với Gemini AI{RESET}")
    
    data = {
        "evidenceType": "Có hình ảnh",
        "description": "Đã chạy bộ 5km sáng nay, cảm thấy rất khỏe",
        "date": "2024-01-15",
        "missionTitle": "Chạy bộ mỗi ngày",
        "missionDescription": "Chạy bộ ít nhất 30 phút mỗi ngày để cải thiện sức khỏe"
    }
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/api/gemini/verify-evidence",
            json=data,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            print_status("Verify Evidence API thành công!", "success")
            print(f"  Result: {result['result']}")
            print(f"  Confidence: {result['confidence']}%")
            print(f"  Reason: {result['reason']}")
            return True
        else:
            print_status(f"API trả về lỗi: {response.status_code}", "error")
            print(f"  Error: {response.text}")
            return False
            
    except Exception as e:
        print_status(f"Lỗi khi gọi API: {str(e)}", "error")
        return False

def test_evaluate_mission():
    """Test endpoint đánh giá nhiệm vụ"""
    print(f"\n{YELLOW}[2] Test Evaluate Mission với Gemini AI{RESET}")
    
    data = {
        "missionTitle": "Học lập trình Python mỗi ngày",
        "missionDescription": "Học và thực hành Python 1 giờ mỗi ngày trong 30 ngày",
        "totalDays": 30,
        "evidences": [
            {
                "date": "2024-01-15",
                "description": "Hoàn thành bài tập về list và dictionary",
                "status": "approved",
                "aiVerification": {"confidence": 85}
            },
            {
                "date": "2024-01-16",
                "description": "Làm project nhỏ về web scraping",
                "status": "approved",
                "aiVerification": {"confidence": 90}
            },
            {
                "date": "2024-01-17",
                "description": "Học về OOP trong Python",
                "status": "approved",
                "aiVerification": {"confidence": 88}
            }
        ]
    }
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/api/gemini/evaluate-mission",
            json=data,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            print_status("Evaluate Mission API thành công!", "success")
            print(f"  Overall Score: {result['overallScore']}/100")
            print(f"  Passed: {result['passedRequirements']}")
            print(f"  Assessment: {result['aiAssessment']}")
            return True
        else:
            print_status(f"API trả về lỗi: {response.status_code}", "error")
            print(f"  Error: {response.text}")
            return False
            
    except Exception as e:
        print_status(f"Lỗi khi gọi API: {str(e)}", "error")
        return False

def main():
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}TEST GEMINI API QUA BACKEND{RESET}")
    print(f"{BLUE}{'='*60}{RESET}\n")
    
    results = []
    
    # Test verify evidence
    results.append(test_verify_evidence())
    
    # Test evaluate mission
    results.append(test_evaluate_mission())
    
    # Tổng kết
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}KẾT QUẢ{RESET}")
    print(f"{BLUE}{'='*60}{RESET}\n")
    
    total = len(results)
    passed = sum(results)
    
    print(f"Tổng số test: {total}")
    print_status(f"Thành công: {passed}/{total}", "success" if passed == total else "warning")
    
    if passed == total:
        print_status("Gemini API đã hoạt động qua Backend!", "success")
    else:
        print_status("Một số test thất bại, hãy kiểm tra lại", "error")
    
    print(f"{BLUE}{'='*60}{RESET}\n")

if __name__ == "__main__":
    main()
