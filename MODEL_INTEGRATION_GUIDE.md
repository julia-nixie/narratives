# Model Integration Guide

This guide explains how to connect your narrative framing model to the demo interface.

## Overview

The demo interface (`demo.html`) provides a complete UI for users to input articles and receive narrative framing predictions. Currently, it runs in "mock mode" with sample responses. Follow this guide to integrate your actual model.

## Files Structure

- `demo.html` - Main demo page with UI
- `demo-styles.css` - Styling for the demo interface
- `demo-script.js` - JavaScript handling UI interactions and model calls
- `MODEL_INTEGRATION_GUIDE.md` - This guide

## Integration Steps

### 1. Configure Your Model Endpoint

In `demo-script.js`, find the `MODEL_CONFIG` object and update it with your model details:

```javascript
const MODEL_CONFIG = {
    // Replace with your actual API endpoint
    apiEndpoint: 'https://your-model-api.com/predict',
    
    // Replace with your API key if needed
    apiKey: 'your-api-key-here',
    
    // Model parameters
    maxTokens: 2048,
    temperature: 0.1,
    
    // Set to false when using real model
    mockMode: false  // CHANGE THIS TO FALSE
};
```

### 2. Customize Model Prompts

Update the `MODEL_PROMPTS` object with prompts that work best with your model:

```javascript
const MODEL_PROMPTS = {
    systemPrompt: `Your system prompt here...`,
    
    analysisPrompt: (article) => `Your analysis prompt template here...
    
    Article: ${article}
    
    Expected JSON response format:
    {
        "hero": {"prediction": "entity", "confidence": 85},
        "villain": {"prediction": "entity", "confidence": 90},
        // ... other components
    }`
};
```

### 3. Implement Your API Call

Modify the `callModelAPI` function to match your model's API:

```javascript
async function callModelAPI(articleText) {
    try {
        const response = await fetch(MODEL_CONFIG.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MODEL_CONFIG.apiKey}`,
                // Add any other headers your API needs
            },
            body: JSON.stringify({
                // Customize this payload for your API
                text: articleText,
                prompt: MODEL_PROMPTS.analysisPrompt(articleText),
                max_tokens: MODEL_CONFIG.maxTokens,
                temperature: MODEL_CONFIG.temperature
            })
        });
        
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }
        
        const data = await response.json();
        return parseModelResponse(data);
        
    } catch (error) {
        console.error('Model API error:', error);
        throw error;
    }
}
```

### 4. Parse Your Model's Response

Update the `parseModelResponse` function to handle your model's output format:

```javascript
function parseModelResponse(apiResponse) {
    // Example for different API response formats:
    
    // OpenAI-style response:
    // const content = apiResponse.choices[0].message.content;
    // return JSON.parse(content);
    
    // Hugging Face response:
    // return JSON.parse(apiResponse.generated_text);
    
    // Custom API response:
    // return {
    //     hero: apiResponse.predictions.hero,
    //     villain: apiResponse.predictions.villain,
    //     // ... map your response to expected format
    // };
    
    // Return the parsed response in the expected format
    return apiResponse;
}
```

## Expected Response Format

Your model should return (or be parsed to return) this JSON structure:

```json
{
    "hero": {
        "prediction": "Climate scientists and researchers",
        "confidence": 88
    },
    "villain": {
        "prediction": "Fossil fuel companies",
        "confidence": 92
    },
    "victim": {
        "prediction": "Future generations",
        "confidence": 85
    },
    "focus": {
        "prediction": "hero",
        "confidence": 80
    },
    "conflict": {
        "prediction": "fuel_resolution",
        "confidence": 75
    },
    "cultural_story": {
        "prediction": "egalitarian",
        "confidence": 87
    },
    "overall_confidence": 84,
    "explanation": "Brief explanation of the analysis and key indicators that led to these predictions."
}
```

### Component Values

**Focus:** `"hero"`, `"villain"`, `"victim"`

**Conflict:** `"fuel_conflict"`, `"fuel_resolution"`, `"prevent_conflict"`, `"prevent_resolution"`

**Cultural Story:** `"individualistic"`, `"hierarchical"`, `"egalitarian"`, `"fatalistic"`

## Testing Your Integration

1. **Enable Mock Mode First:** Keep `mockMode: true` while testing the UI
2. **Test Sample Articles:** Use the provided sample articles to verify UI functionality
3. **Implement Your API:** Update the configuration and functions as described above
4. **Disable Mock Mode:** Set `mockMode: false` to use your real model
5. **Test Real Predictions:** Try various articles to ensure your model integration works

## Error Handling

The interface includes built-in error handling for:
- Empty input validation
- API request failures
- Network errors
- Invalid response formats

Make sure your API returns appropriate HTTP status codes and error messages.

## Customization Options

### Adding More Sample Articles

Add new samples to the `sampleArticles` object in `demo-script.js`:

```javascript
const sampleArticles = {
    // existing samples...
    newSample: `Your new sample article text here...`
};
```

Then update the dropdown in `demo.html`:

```html
<option value="newSample">New Sample Description</option>
```

### Modifying the UI

- **Styling:** Edit `demo-styles.css` to change colors, fonts, layout
- **Layout:** Modify `demo.html` to add/remove sections or change structure
- **Functionality:** Update `demo-script.js` to add new features or modify behavior

### Adding Authentication

If your model requires authentication beyond API keys:

```javascript
// Add authentication headers
headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${MODEL_CONFIG.apiKey}`,
    'X-Custom-Auth': 'your-auth-token',
    // Add other auth headers as needed
}
```

## Deployment Considerations

### CORS Issues

If you encounter CORS errors when calling your API from the browser:

1. **Server-side:** Configure your API to allow requests from your domain
2. **Proxy:** Use a server-side proxy to make API calls
3. **JSONP:** If your API supports it (not recommended for production)

### Rate Limiting

Consider implementing client-side rate limiting:

```javascript
// Add rate limiting logic
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2000; // 2 seconds

async function analyzeArticle() {
    const now = Date.now();
    if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
        showMessage('Please wait before making another request.', 'error');
        return;
    }
    lastRequestTime = now;
    
    // ... rest of function
}
```

### Security

- **API Keys:** Never expose sensitive API keys in client-side code
- **Input Validation:** Validate and sanitize user input before sending to your model
- **Rate Limiting:** Implement server-side rate limiting to prevent abuse

## Troubleshooting

### Common Issues

1. **CORS Errors:** Configure your API server to allow cross-origin requests
2. **Authentication Failures:** Verify API keys and authentication headers
3. **Response Format Errors:** Ensure your `parseModelResponse` function handles your API's format
4. **Network Timeouts:** Add timeout handling for slow API responses

### Debug Mode

Enable console logging for debugging:

```javascript
// Add at the top of demo-script.js
const DEBUG_MODE = true;

// Use throughout the code
if (DEBUG_MODE) {
    console.log('API Request:', requestData);
    console.log('API Response:', responseData);
}
```

## Support

For questions about the demo interface or integration:
- Check the browser console for error messages
- Verify your API endpoint is accessible
- Test your API independently before integrating
- Ensure response format matches expectations

The demo interface is designed to be flexible and work with various model architectures and API formats. Customize the integration functions as needed for your specific setup.
