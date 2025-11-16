import google.generativeai as genai

GEMINI_API_KEY = "AIzaSyCCXyqNsqe1Ng2_15VH8V7QfI6usBCtuxM"

def test_gemini_api():
    """Test the Gemini API connection and key validity."""
    try:
        # Configure the API key
        genai.configure(api_key=GEMINI_API_KEY)
        
        # List available models first
        print("Listing available models...")
        for model in genai.list_models():
            if 'generateContent' in model.supported_generation_methods:
                print(f"- {model.name}")
        
        # Try with gemini-2.5-flash-lite (latest stable version)
        print("\nTesting Gemini API connection...")
        model = genai.GenerativeModel('gemini-2.5-flash-lite')
        
        # Send a simple test prompt
        response = model.generate_content("Say hello and confirm you're working!")
        
        # Print the response
        print("\n✅ Success! API key is valid.")
        print(f"\nResponse from Gemini:\n{response.text}")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    test_gemini_api()