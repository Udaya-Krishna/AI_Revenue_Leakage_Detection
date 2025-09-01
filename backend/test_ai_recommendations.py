#!/usr/bin/env python3
"""
Test script for AI-powered recommendations using Gemini API
This script tests the enhanced recommendation generation functionality
"""

import requests
import json
import os
from datetime import datetime

BASE_URL = "http://localhost:5000"

def test_ai_recommendations():
    """Test AI recommendations generation for both domains"""
    print("🤖 Testing Enhanced AI-Powered Recommendations Generation")
    print("=" * 70)
    
    # Test AI recommendations endpoint
    print("\n🔍 Testing AI Recommendations Endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/test-ai-recommendations")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ AI recommendations test successful")
            
            # Check supermarket recommendations
            if data['results']['supermarket']['success']:
                print(f"\n🛒 Supermarket AI Recommendations:")
                print(f"   Records analyzed: {data['results']['supermarket']['record_count']:,}")
                print(f"   Total leakage: ₹{data['results']['supermarket']['total_leakage_inr']:,.2f}")
                print(f"   Leakage percentage: {data['results']['supermarket']['leakage_percentage']:.2f}%")
                print(f"   AI recommendations generated: {data['results']['supermarket']['recommendation_count']}")
                
                print("\n   Sample recommendations:")
                for i, rec in enumerate(data['results']['supermarket']['ai_recommendations'][:3], 1):
                    print(f"   {i}. {rec[:100]}...")
                
                supermarket_success = True
            else:
                print(f"\n❌ Supermarket AI recommendations failed:")
                print(f"   Error: {data['results']['supermarket']['error']}")
                supermarket_success = False
            
            # Check telecom recommendations
            if data['results']['telecom']['success']:
                print(f"\n📱 Telecom AI Recommendations:")
                print(f"   Records analyzed: {data['results']['telecom']['record_count']:,}")
                print(f"   Total leakage: ₹{data['results']['telecom']['total_leakage_inr']:,.2f}")
                print(f"   Leakage percentage: {data['results']['telecom']['leakage_percentage']:.2f}%")
                print(f"   AI recommendations generated: {data['results']['telecom']['recommendation_count']}")
                
                print("\n   Sample recommendations:")
                for i, rec in enumerate(data['results']['telecom']['ai_recommendations'][:3], 1):
                    print(f"   {i}. {rec[:100]}...")
                
                telecom_success = True
            else:
                print(f"\n❌ Telecom AI recommendations failed:")
                print(f"   Error: {data['results']['telecom']['error']}")
                telecom_success = False
            
            print(f"\n💡 Note: {data['note']}")
            print("\n🔍 Enhanced Features:")
            print("   • Detailed data analysis with grouped metrics")
            print("   • Root cause analysis by anomaly type and location")
            print("   • Statistical breakdown of leakage amounts")
            print("   • Specific, actionable recommendations")
            
        else:
            print(f"❌ Failed to test AI recommendations: {response.status_code}")
            try:
                error_data = response.json()
                print(f"   Error: {error_data.get('error', 'Unknown error')}")
            except:
                print(f"   Response: {response.text[:200]}...")
            return False, False
            
    except Exception as e:
        print(f"❌ Error testing AI recommendations: {e}")
        return False, False
    
    return supermarket_success, telecom_success

def test_word_document_with_ai_recommendations():
    """Test Word document generation with AI recommendations"""
    print("\n📄 Testing Word Document Generation with AI Recommendations")
    print("=" * 70)
    
    # Test supermarket report generation
    print("\n🛒 Testing Supermarket Word Report with AI Recommendations...")
    try:
        response = requests.post(f"{BASE_URL}/api/supermarket/generate-report/test_session")
        
        if response.status_code == 200:
            content_type = response.headers.get('content-type', '')
            if 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' in content_type:
                print("✅ Supermarket Word document generated successfully!")
                print(f"   Content-Type: {content_type}")
                print(f"   File Size: {len(response.content):,} bytes")
                
                # Save the file for inspection
                filename = f"test_supermarket_ai_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.docx"
                with open(filename, 'wb') as f:
                    f.write(response.content)
                print(f"   File saved as: {filename}")
                
                supermarket_success = True
            else:
                print(f"❌ Unexpected content type: {content_type}")
                supermarket_success = False
        else:
            print(f"❌ Failed to generate supermarket report: {response.status_code}")
            supermarket_success = False
            
    except Exception as e:
        print(f"❌ Error testing supermarket report: {e}")
        supermarket_success = False
    
    # Test telecom report generation
    print("\n📱 Testing Telecom Word Report with AI Recommendations...")
    try:
        response = requests.post(f"{BASE_URL}/api/telecom/generate-report/test_session")
        
        if response.status_code == 200:
            content_type = response.headers.get('content-type', '')
            if 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' in content_type:
                print("✅ Telecom Word document generated successfully!")
                print(f"   Content-Type: {content_type}")
                print(f"   File Size: {len(response.content):,} bytes")
                
                # Save the file for inspection
                filename = f"test_telecom_ai_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.docx"
                with open(filename, 'wb') as f:
                    f.write(response.content)
                print(f"   File saved as: {filename}")
                
                telecom_success = True
            else:
                print(f"❌ Unexpected content type: {content_type}")
                telecom_success = False
        else:
            print(f"❌ Failed to generate telecom report: {response.status_code}")
            telecom_success = False
            
    except Exception as e:
        print(f"❌ Error testing telecom report: {e}")
        telecom_success = False
    
    return supermarket_success, telecom_success

def check_environment_setup():
    """Check if the environment is properly set up for AI recommendations"""
    print("🔧 Checking Environment Setup for AI Recommendations")
    print("=" * 70)
    
    # Check if GEMINI_API_KEY is set
    gemini_key = os.getenv('GEMINI_API_KEY')
    if gemini_key:
        print("✅ GEMINI_API_KEY is configured")
        print(f"   Key length: {len(gemini_key)} characters")
        print(f"   Key preview: {gemini_key[:8]}...{gemini_key[-4:]}")
    else:
        print("❌ GEMINI_API_KEY is not configured")
        print("   Set the environment variable to enable AI-generated recommendations")
        print("   Example: export GEMINI_API_KEY='your_api_key_here'")
    
    # Check if anomaly data exists
    print("\n📊 Checking Data Availability:")
    
    supermarket_path = "model/super_market/output_datasets/anomaly_data.csv"
    telecom_path = "model/Telecom/output_dataset/telecom_anomaly_data.csv"
    
    if os.path.exists(supermarket_path):
        print(f"   ✅ Supermarket data: {supermarket_path}")
    else:
        print(f"   ❌ Supermarket data not found: {supermarket_path}")
    
    if os.path.exists(telecom_path):
        print(f"   ✅ Telecom data: {telecom_path}")
    else:
        print(f"   ❌ Telecom data not found: {telecom_path}")
    
    return gemini_key is not None

def main():
    """Main test function"""
    print("🚀 Testing AI-Powered Recommendations System")
    print("=" * 70)
    
    # Check environment setup
    env_ready = check_environment_setup()
    
    if not env_ready:
        print("\n⚠️  Environment not fully configured for AI recommendations.")
        print("   Reports will use fallback recommendations instead.")
    
    # Test AI recommendations generation
    ai_supermarket_success, ai_telecom_success = test_ai_recommendations()
    
    # Test Word document generation with AI recommendations
    word_supermarket_success, word_telecom_success = test_word_document_with_ai_recommendations()
    
    # Summary
    print("\n" + "=" * 70)
    print("📋 Test Summary")
    print("=" * 70)
    print(f"   Environment setup: {'✅ Ready' if env_ready else '⚠️  Limited'}")
    print(f"   Supermarket AI recommendations: {'✅ Passed' if ai_supermarket_success else '❌ Failed'}")
    print(f"   Telecom AI recommendations: {'✅ Passed' if ai_telecom_success else '❌ Failed'}")
    print(f"   Supermarket Word report: {'✅ Passed' if word_supermarket_success else '❌ Failed'}")
    print(f"   Telecom Word report: {'✅ Passed' if word_telecom_success else '❌ Failed'}")
    
    if all([ai_supermarket_success, ai_telecom_success, word_supermarket_success, word_telecom_success]):
        print("\n🎉 All tests passed! AI-powered recommendations system is working correctly.")
        print("\n📁 Generated Word documents have been saved in the current directory.")
        print("   Open them to verify they contain:")
        print("   • Executive summary with tables")
        print("   • Data visualizations (charts and graphs)")
        print("   • Detailed analysis")
        print("   • AI-generated, domain-specific recommendations")
        
        if env_ready:
            print("\n🤖 AI recommendations are enabled and working!")
        else:
            print("\n💡 AI recommendations are working with fallback data.")
            
    else:
        print("\n⚠️  Some tests failed. Please check the error messages above.")
        print("\n💡 Make sure:")
        print("   • Backend is running")
        print("   • Analysis has been completed (anomaly data exists)")
        print("   • GEMINI_API_KEY is set for AI recommendations")
        print("   • All required Python packages are installed")

if __name__ == "__main__":
    main()
