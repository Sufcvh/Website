import requests
import sys
import json
from datetime import datetime, timezone

class JobTrackerAPITester:
    def __init__(self, base_url="https://employ-quest-3.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.created_app_ids = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if endpoint else self.api_url
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        return self.run_test("Root API Endpoint", "GET", "", 200)

    def test_create_application(self, app_data):
        """Test creating a new application"""
        success, response = self.run_test(
            "Create Application",
            "POST",
            "applications",
            200,
            data=app_data
        )
        if success and 'id' in response:
            self.created_app_ids.append(response['id'])
            return response['id']
        return None

    def test_get_applications(self):
        """Test getting all applications"""
        return self.run_test("Get All Applications", "GET", "applications", 200)

    def test_get_application_by_id(self, app_id):
        """Test getting a specific application"""
        return self.run_test(
            f"Get Application {app_id}",
            "GET",
            f"applications/{app_id}",
            200
        )

    def test_update_application(self, app_id, update_data):
        """Test updating an application"""
        return self.run_test(
            f"Update Application {app_id}",
            "PUT",
            f"applications/{app_id}",
            200,
            data=update_data
        )

    def test_delete_application(self, app_id):
        """Test deleting an application"""
        return self.run_test(
            f"Delete Application {app_id}",
            "DELETE",
            f"applications/{app_id}",
            200
        )

    def test_get_stats(self):
        """Test getting statistics"""
        return self.run_test("Get Statistics", "GET", "stats", 200)

    def test_nonexistent_application(self):
        """Test getting a non-existent application"""
        return self.run_test(
            "Get Non-existent Application",
            "GET",
            "applications/nonexistent-id",
            404
        )

def main():
    print("🚀 Starting Job Tracker API Tests")
    print("=" * 50)
    
    tester = JobTrackerAPITester()
    
    # Test 1: Root endpoint
    tester.test_root_endpoint()
    
    # Test 2: Get initial stats
    print("\n📊 Testing initial stats...")
    tester.test_get_stats()
    
    # Test 3: Get all applications (should work even if empty)
    print("\n📋 Testing get all applications...")
    tester.test_get_applications()
    
    # Test 4: Create test applications
    print("\n➕ Testing application creation...")
    
    test_apps = [
        {
            "company": "Test Company 1",
            "position": "Software Engineer",
            "status": "applied",
            "date_applied": "2024-01-15",
            "salary_range": "$80k - $120k",
            "job_description": "Full-stack development role",
            "contact_person": "John Doe",
            "contact_email": "john@testcompany1.com",
            "notes": "Applied through LinkedIn",
            "company_logo": "https://example.com/logo1.png",
            "interview_date": "2024-02-01T10:00:00"
        },
        {
            "company": "Test Company 2", 
            "position": "Frontend Developer",
            "status": "shortlisted",
            "date_applied": "2024-01-20",
            "salary_range": "$70k - $100k",
            "interview_date": "2024-02-05T14:30:00"
        }
    ]
    
    created_ids = []
    for i, app_data in enumerate(test_apps):
        app_id = tester.test_create_application(app_data)
        if app_id:
            created_ids.append(app_id)
    
    # Test 5: Get applications after creation
    print("\n📋 Testing get applications after creation...")
    tester.test_get_applications()
    
    # Test 6: Get individual applications
    print("\n🔍 Testing get individual applications...")
    for app_id in created_ids:
        tester.test_get_application_by_id(app_id)
    
    # Test 7: Update application status (test drag-and-drop functionality)
    print("\n✏️ Testing application updates...")
    if created_ids:
        update_data = {"status": "round1"}
        tester.test_update_application(created_ids[0], update_data)
        
        # Update with multiple fields
        update_data = {
            "status": "round2",
            "notes": "Updated notes after interview",
            "interview_date": "2024-02-10T15:00:00"
        }
        tester.test_update_application(created_ids[0], update_data)
    
    # Test 8: Get updated stats
    print("\n📊 Testing stats after updates...")
    tester.test_get_stats()
    
    # Test 9: Test error cases
    print("\n❌ Testing error cases...")
    tester.test_nonexistent_application()
    
    # Test 10: Delete applications
    print("\n🗑️ Testing application deletion...")
    for app_id in created_ids:
        tester.test_delete_application(app_id)
    
    # Test 11: Verify deletion
    print("\n✅ Verifying deletion...")
    if created_ids:
        tester.test_get_application_by_id(created_ids[0])  # Should return 404
    
    # Final stats
    print("\n" + "=" * 50)
    print(f"📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All backend API tests passed!")
        return 0
    else:
        print("⚠️ Some backend API tests failed!")
        return 1

if __name__ == "__main__":
    sys.exit(main())