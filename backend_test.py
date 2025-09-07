#!/usr/bin/env python3
"""
Vizinhando Backend API Test Suite
Tests all backend endpoints comprehensively
"""

import requests
import json
import sys
from typing import Dict, Any, List
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get the backend URL from frontend environment
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'https://mbway-delivery.preview.emergentagent.com')
API_BASE_URL = f"{BACKEND_URL}/api"

class VizinhandoAPITester:
    def __init__(self):
        self.base_url = API_BASE_URL
        self.session = requests.Session()
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, message: str, response_data: Any = None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        
        self.test_results.append({
            'test': test_name,
            'success': success,
            'message': message,
            'response_data': response_data
        })
        
    def test_root_endpoint(self):
        """Test GET /api/ endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/")
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "Vizinhando" in data["message"]:
                    self.log_test("Root Endpoint", True, f"API is running: {data['message']}")
                    return True
                else:
                    self.log_test("Root Endpoint", False, f"Unexpected response format: {data}")
                    return False
            else:
                self.log_test("Root Endpoint", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Root Endpoint", False, f"Connection error: {str(e)}")
            return False
    
    def test_restaurants_endpoint(self):
        """Test GET /api/restaurants endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/restaurants")
            
            if response.status_code == 200:
                restaurants = response.json()
                
                if isinstance(restaurants, list):
                    if len(restaurants) > 0:
                        # Check first restaurant structure
                        first_restaurant = restaurants[0]
                        required_fields = ['name', 'description', 'cuisine', 'rating', 'deliveryTime', 'deliveryFee']
                        
                        missing_fields = [field for field in required_fields if field not in first_restaurant]
                        
                        if not missing_fields:
                            # Check for Portuguese content
                            portuguese_indicators = any(
                                any(word in str(restaurant.get(field, '')).lower() for word in 
                                    ['portuguesa', 'brasileiro', 'lisboa', 'porto', 'açaí', 'pastel', 'coxinha'])
                                for restaurant in restaurants[:3]  # Check first 3 restaurants
                                for field in ['name', 'description', 'cuisine']
                            )
                            
                            self.log_test("Restaurants Endpoint", True, 
                                        f"Found {len(restaurants)} restaurants with proper structure. Portuguese content: {'Yes' if portuguese_indicators else 'No'}")
                            return restaurants
                        else:
                            self.log_test("Restaurants Endpoint", False, 
                                        f"Missing required fields: {missing_fields}")
                            return None
                    else:
                        self.log_test("Restaurants Endpoint", False, "No restaurants found in database")
                        return None
                else:
                    self.log_test("Restaurants Endpoint", False, f"Expected list, got: {type(restaurants)}")
                    return None
            else:
                self.log_test("Restaurants Endpoint", False, f"HTTP {response.status_code}: {response.text}")
                return None
                
        except Exception as e:
            self.log_test("Restaurants Endpoint", False, f"Error: {str(e)}")
            return None
    
    def test_categories_endpoint(self):
        """Test GET /api/categories endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/categories")
            
            if response.status_code == 200:
                categories = response.json()
                
                if isinstance(categories, list):
                    if len(categories) > 0:
                        # Check first category structure
                        first_category = categories[0]
                        required_fields = ['name', 'icon', 'color']
                        
                        missing_fields = [field for field in required_fields if field not in first_category]
                        
                        if not missing_fields:
                            category_names = [cat.get('name', '') for cat in categories]
                            self.log_test("Categories Endpoint", True, 
                                        f"Found {len(categories)} categories: {', '.join(category_names[:5])}")
                            return categories
                        else:
                            self.log_test("Categories Endpoint", False, 
                                        f"Missing required fields: {missing_fields}")
                            return None
                    else:
                        self.log_test("Categories Endpoint", False, "No categories found in database")
                        return None
                else:
                    self.log_test("Categories Endpoint", False, f"Expected list, got: {type(categories)}")
                    return None
            else:
                self.log_test("Categories Endpoint", False, f"HTTP {response.status_code}: {response.text}")
                return None
                
        except Exception as e:
            self.log_test("Categories Endpoint", False, f"Error: {str(e)}")
            return None
    
    def test_restaurant_by_id(self, restaurants: List[Dict]):
        """Test GET /api/restaurants/{id} endpoint"""
        if not restaurants:
            self.log_test("Restaurant By ID", False, "No restaurants available for testing")
            return None
            
        try:
            # Test with first restaurant
            restaurant_id = restaurants[0].get('id') or restaurants[0].get('_id')
            if not restaurant_id:
                self.log_test("Restaurant By ID", False, "No ID found in restaurant data")
                return None
                
            response = self.session.get(f"{self.base_url}/restaurants/{restaurant_id}")
            
            if response.status_code == 200:
                restaurant = response.json()
                
                if restaurant.get('name') == restaurants[0].get('name'):
                    self.log_test("Restaurant By ID", True, 
                                f"Successfully retrieved restaurant: {restaurant.get('name')}")
                    return restaurant
                else:
                    self.log_test("Restaurant By ID", False, "Retrieved restaurant doesn't match expected")
                    return None
            else:
                self.log_test("Restaurant By ID", False, f"HTTP {response.status_code}: {response.text}")
                return None
                
        except Exception as e:
            self.log_test("Restaurant By ID", False, f"Error: {str(e)}")
            return None
    
    def test_restaurant_menu(self, restaurants: List[Dict]):
        """Test GET /api/restaurants/{id}/menu endpoint"""
        if not restaurants:
            self.log_test("Restaurant Menu", False, "No restaurants available for testing")
            return None
            
        try:
            # Test with first restaurant
            restaurant_id = restaurants[0].get('id') or restaurants[0].get('_id')
            if not restaurant_id:
                self.log_test("Restaurant Menu", False, "No ID found in restaurant data")
                return None
                
            response = self.session.get(f"{self.base_url}/restaurants/{restaurant_id}/menu")
            
            if response.status_code == 200:
                menu_items = response.json()
                
                if isinstance(menu_items, list):
                    self.log_test("Restaurant Menu", True, 
                                f"Retrieved menu with {len(menu_items)} items for {restaurants[0].get('name')}")
                    return menu_items
                else:
                    self.log_test("Restaurant Menu", False, f"Expected list, got: {type(menu_items)}")
                    return None
            else:
                self.log_test("Restaurant Menu", False, f"HTTP {response.status_code}: {response.text}")
                return None
                
        except Exception as e:
            self.log_test("Restaurant Menu", False, f"Error: {str(e)}")
            return None
    
    def test_restaurants_with_filters(self):
        """Test restaurants endpoint with category and search filters"""
        try:
            # Test category filter
            response = self.session.get(f"{self.base_url}/restaurants?category=Italiana")
            
            if response.status_code == 200:
                filtered_restaurants = response.json()
                self.log_test("Restaurant Category Filter", True, 
                            f"Category filter returned {len(filtered_restaurants)} restaurants")
            else:
                self.log_test("Restaurant Category Filter", False, f"HTTP {response.status_code}")
            
            # Test search filter
            response = self.session.get(f"{self.base_url}/restaurants?search=pizza")
            
            if response.status_code == 200:
                search_restaurants = response.json()
                self.log_test("Restaurant Search Filter", True, 
                            f"Search filter returned {len(search_restaurants)} restaurants")
            else:
                self.log_test("Restaurant Search Filter", False, f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test("Restaurant Filters", False, f"Error: {str(e)}")
    
    def test_error_handling(self):
        """Test error handling with invalid requests"""
        try:
            # Test invalid restaurant ID
            response = self.session.get(f"{self.base_url}/restaurants/invalid_id")
            
            if response.status_code == 400:
                self.log_test("Invalid Restaurant ID", True, "Properly handled invalid ID with 400 status")
            else:
                self.log_test("Invalid Restaurant ID", False, f"Expected 400, got {response.status_code}")
            
            # Test non-existent restaurant ID
            response = self.session.get(f"{self.base_url}/restaurants/507f1f77bcf86cd799439011")
            
            if response.status_code == 404:
                self.log_test("Non-existent Restaurant", True, "Properly handled non-existent restaurant with 404")
            else:
                self.log_test("Non-existent Restaurant", False, f"Expected 404, got {response.status_code}")
            
            # Test non-existent endpoint
            response = self.session.get(f"{self.base_url}/nonexistent")
            
            if response.status_code == 404:
                self.log_test("Non-existent Endpoint", True, "Properly handled non-existent endpoint")
            else:
                self.log_test("Non-existent Endpoint", False, f"Expected 404, got {response.status_code}")
                
        except Exception as e:
            self.log_test("Error Handling", False, f"Error: {str(e)}")
    
    def run_all_tests(self):
        """Run all API tests"""
        print(f"🚀 Starting Vizinhando API Tests")
        print(f"📍 Testing API at: {self.base_url}")
        print("=" * 60)
        
        # Test basic connectivity
        if not self.test_root_endpoint():
            print("❌ Root endpoint failed - stopping tests")
            return False
        
        # Test main endpoints
        restaurants = self.test_restaurants_endpoint()
        categories = self.test_categories_endpoint()
        
        # Test specific restaurant operations
        if restaurants:
            self.test_restaurant_by_id(restaurants)
            self.test_restaurant_menu(restaurants)
        
        # Test filters
        self.test_restaurants_with_filters()
        
        # Test error handling
        self.test_error_handling()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result['success'])
        total = len(self.test_results)
        
        print(f"✅ Passed: {passed}/{total}")
        print(f"❌ Failed: {total - passed}/{total}")
        
        if total - passed > 0:
            print("\n🔍 FAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"   • {result['test']}: {result['message']}")
        
        return passed == total

def main():
    """Main test execution"""
    tester = VizinhandoAPITester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All tests passed! Vizinhando API is working correctly.")
        sys.exit(0)
    else:
        print("\n⚠️  Some tests failed. Check the details above.")
        sys.exit(1)

if __name__ == "__main__":
    main()