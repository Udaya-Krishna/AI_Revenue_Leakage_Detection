import os
import google.generativeai as genai
from dotenv import load_dotenv

def test_gemini_api():
    # Load environment variables
    load_dotenv()
    
    # Get API key
    api_key = os.getenv('GEMINI_API_KEY')
    print(f"API Key found: {'Yes' if api_key else 'No'}")
    if api_key:
        print(f"Key starts with: {api_key[:5]}...")
    
    # Configure and test
    try:
        genai.configure(api_key=api_key)
        print("\nTesting API connection...")
        
        # List available models
        models = genai.list_models()
        print("\nAvailable models:")
        for m in models:
            if 'gemini' in m.name.lower():
                print(f"- {m.name}")
        
        # Test a simple generation
        print("\nTesting text generation...")
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content("Say 'Hello, World!' in a creative way.")
        print("\nResponse:", response.text)
        
    except Exception as e:
        print("\nError:", str(e))
        if "quota" in str(e).lower():
            print("\n⚠️  You've hit a quota limit. Check your Google AI Studio dashboard.")
        elif "API key" in str(e):
            print("\n❌ Invalid API key. Please check your .env file.")
        else:
            print("\n❌ An unexpected error occurred.")

if __name__ == "__main__":
    test_gemini_api()
