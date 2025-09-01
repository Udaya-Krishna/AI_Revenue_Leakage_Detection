#!/usr/bin/env python3
"""
Test script for report generation endpoints
This script tests the report generation functionality using the anomaly dataset files
"""

import requests
import json
import os

BASE_URL = "http://localhost:5000"

def test_check_anomaly_data():
    """Test the endpoint to check if anomaly data exists"""
    print("🔍 Testing anomaly data availability...")
    
    try:
        response = requests.get(f"{BASE_URL}/api/check-anomaly-data")
        if response.status_code == 200:
            data = response.json()
            print("✅ Anomaly data check successful")
            print(f"   Supermarket data: {'✅ Available' if data['data']['supermarket']['exists'] else '❌ Not found'}")
            print(f"   Telecom data: {'✅ Available' if data['data']['telecom']['exists'] else '❌ Not found'}")
            return data['data']
        else:
            print(f"❌ Failed to check anomaly data: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Error checking anomaly data: {e}")
        return None

def test_anomaly_data_info():
    """Test the endpoint to get detailed anomaly data information"""
    print("\n📊 Testing anomaly data info...")
    
    try:
        response = requests.get(f"{BASE_URL}/api/anomaly-data-info")
        if response.status_code == 200:
            data = response.json()
            print("✅ Anomaly data info successful")
            
            if data['data']['supermarket']['exists']:
                print(f"   Supermarket: {data['data']['supermarket']['record_count']} records")
                print(f"   Columns: {', '.join(data['data']['supermarket']['columns'][:5])}...")
            
            if data['data']['telecom']['exists']:
                print(f"   Telecom: {data['data']['telecom']['record_count']} records")
                print(f"   Columns: {', '.join(data['data']['telecom']['columns'][:5])}...")
            
            return data['data']
        else:
            print(f"❌ Failed to get anomaly data info: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Error getting anomaly data info: {e}")
        return None

def test_supermarket_report_generation():
    """Test supermarket report generation"""
    print("\n🛒 Testing supermarket report generation...")
    
    try:
        response = requests.post(f"{BASE_URL}/api/supermarket/generate-report/test_session")
        if response.status_code == 200:
            data = response.json()
            print("✅ Supermarket report generation successful")
            print(f"   Report type: {data['report']['summary']['report_type']}")
            print(f"   Total anomalies: {data['report']['summary']['total_anomalies']}")
            print(f"   Total leakage: ₹{data['report']['summary']['total_leakage_inr']:,.2f}")
            print(f"   Leakage percentage: {data['report']['summary']['leakage_percentage']:.2f}%")
            return True
        else:
            print(f"❌ Failed to generate supermarket report: {response.status_code}")
            error_data = response.json()
            print(f"   Error: {error_data.get('error', 'Unknown error')}")
            return False
    except Exception as e:
        print(f"❌ Error generating supermarket report: {e}")
        return False

def test_telecom_report_generation():
    """Test telecom report generation"""
    print("\n📱 Testing telecom report generation...")
    
    try:
        response = requests.post(f"{BASE_URL}/api/telecom/generate-report/test_session")
        if response.status_code == 200:
            data = response.json()
            print("✅ Telecom report generation successful")
            print(f"   Report type: {data['report']['summary']['report_type']}")
            print(f"   Total anomalies: {data['report']['summary']['total_anomalies']}")
            print(f"   Total leakage: ₹{data['report']['summary']['total_leakage_inr']:,.2f}")
            print(f"   Leakage percentage: {data['report']['summary']['leakage_percentage']:.2f}%")
            return True
        else:
            print(f"❌ Failed to generate telecom report: {response.status_code}")
            error_data = response.json()
            print(f"   Error: {error_data.get('error', 'Unknown error')}")
            return False
    except Exception as e:
        print(f"❌ Error generating telecom report: {e}")
        return False

def main():
    """Main test function"""
    print("🚀 Testing Report Generation System")
    print("=" * 50)
    
    # Check if anomaly data exists
    anomaly_data = test_check_anomaly_data()
    if not anomaly_data:
        print("\n❌ Cannot proceed without anomaly data")
        return
    
    # Get detailed anomaly data info
    anomaly_info = test_anomaly_data_info()
    
    # Test report generation for both domains
    supermarket_success = test_supermarket_report_generation()
    telecom_success = test_telecom_report_generation()
    
    # Summary
    print("\n" + "=" * 50)
    print("📋 Test Summary")
    print("=" * 50)
    print(f"   Anomaly data check: {'✅ Passed' if anomaly_data else '❌ Failed'}")
    print(f"   Anomaly data info: {'✅ Passed' if anomaly_info else '❌ Failed'}")
    print(f"   Supermarket report: {'✅ Passed' if supermarket_success else '❌ Failed'}")
    print(f"   Telecom report: {'✅ Passed' if telecom_success else '❌ Failed'}")
    
    if all([anomaly_data, anomaly_info, supermarket_success, telecom_success]):
        print("\n🎉 All tests passed! Report generation system is working correctly.")
    else:
        print("\n⚠️  Some tests failed. Please check the error messages above.")

if __name__ == "__main__":
    main()
