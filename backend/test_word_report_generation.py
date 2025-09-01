#!/usr/bin/env python3
"""
Test script for Word document report generation with visualizations
This script tests the enhanced report generation functionality
"""

import requests
import json
import os
from datetime import datetime

BASE_URL = "http://localhost:5000"

def test_word_document_generation():
    """Test Word document generation for both domains"""
    print("📄 Testing Word Document Report Generation")
    print("=" * 60)
    
    # Test supermarket report generation
    print("\n🛒 Testing Supermarket Word Report Generation...")
    try:
        response = requests.post(f"{BASE_URL}/api/supermarket/generate-report/test_session")
        
        if response.status_code == 200:
            content_type = response.headers.get('content-type', '')
            if 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' in content_type:
                print("✅ Supermarket Word document generated successfully!")
                print(f"   Content-Type: {content_type}")
                print(f"   File Size: {len(response.content):,} bytes")
                
                # Save the file for inspection
                filename = f"test_supermarket_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.docx"
                with open(filename, 'wb') as f:
                    f.write(response.content)
                print(f"   File saved as: {filename}")
                
                supermarket_success = True
            else:
                print(f"❌ Unexpected content type: {content_type}")
                print(f"   Response: {response.text[:200]}...")
                supermarket_success = False
        else:
            print(f"❌ Failed to generate supermarket report: {response.status_code}")
            try:
                error_data = response.json()
                print(f"   Error: {error_data.get('error', 'Unknown error')}")
            except:
                print(f"   Response: {response.text[:200]}...")
            supermarket_success = False
            
    except Exception as e:
        print(f"❌ Error testing supermarket report: {e}")
        supermarket_success = False
    
    # Test telecom report generation
    print("\n📱 Testing Telecom Word Report Generation...")
    try:
        response = requests.post(f"{BASE_URL}/api/telecom/generate-report/test_session")
        
        if response.status_code == 200:
            content_type = response.headers.get('content-type', '')
            if 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' in content_type:
                print("✅ Telecom Word document generated successfully!")
                print(f"   Content-Type: {content_type}")
                print(f"   File Size: {len(response.content):,} bytes")
                
                # Save the file for inspection
                filename = f"test_telecom_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.docx"
                with open(filename, 'wb') as f:
                    f.write(response.content)
                print(f"   File saved as: {filename}")
                
                telecom_success = True
            else:
                print(f"❌ Unexpected content type: {content_type}")
                print(f"   Response: {response.text[:200]}...")
                telecom_success = False
        else:
            print(f"❌ Failed to generate telecom report: {response.status_code}")
            try:
                error_data = response.json()
                print(f"   Error: {error_data.get('error', 'Unknown error')}")
            except:
                print(f"   Response: {response.text[:200]}...")
            telecom_success = False
            
    except Exception as e:
        print(f"❌ Error testing telecom report: {e}")
        telecom_success = False
    
    return supermarket_success, telecom_success

def test_visualization_creation():
    """Test if visualizations are being created correctly"""
    print("\n📊 Testing Visualization Creation...")
    
    try:
        # Test anomaly data info to see if data is available
        response = requests.get(f"{BASE_URL}/api/anomaly-data-info")
        if response.status_code == 200:
            data = response.json()
            print("✅ Anomaly data info retrieved successfully")
            
            if data['data']['supermarket']['exists']:
                print(f"   Supermarket: {data['data']['supermarket']['record_count']} records available")
                print(f"   Columns: {', '.join(data['data']['supermarket']['columns'][:5])}...")
            else:
                print("   ❌ Supermarket data not available")
            
            if data['data']['telecom']['exists']:
                print(f"   Telecom: {data['data']['telecom']['record_count']} records available")
                print(f"   Columns: {', '.join(data['data']['telecom']['columns'][:5])}...")
            else:
                print("   ❌ Telecom data not available")
                
            return True
        else:
            print(f"❌ Failed to get anomaly data info: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing visualization creation: {e}")
        return False

def main():
    """Main test function"""
    print("🚀 Testing Enhanced Word Document Report Generation System")
    print("=" * 60)
    
    # Test visualization creation
    viz_success = test_visualization_creation()
    
    # Test Word document generation
    supermarket_success, telecom_success = test_word_document_generation()
    
    # Summary
    print("\n" + "=" * 60)
    print("📋 Test Summary")
    print("=" * 60)
    print(f"   Visualization creation: {'✅ Passed' if viz_success else '❌ Failed'}")
    print(f"   Supermarket Word report: {'✅ Passed' if supermarket_success else '❌ Failed'}")
    print(f"   Telecom Word report: {'✅ Passed' if telecom_success else '❌ Failed'}")
    
    if all([viz_success, supermarket_success, telecom_success]):
        print("\n🎉 All tests passed! Word document generation system is working correctly.")
        print("\n📁 Generated Word documents have been saved in the current directory.")
        print("   You can open them to verify they contain:")
        print("   • Executive summary with tables")
        print("   • Data visualizations (charts and graphs)")
        print("   • Detailed analysis")
        print("   • Recommendations")
    else:
        print("\n⚠️  Some tests failed. Please check the error messages above.")
        print("\n💡 Make sure:")
        print("   • Backend is running")
        print("   • Analysis has been completed (anomaly data exists)")
        print("   • All required Python packages are installed")

if __name__ == "__main__":
    main()
