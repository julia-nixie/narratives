// Demo Script for Narrative Framing Model Interface
// This script handles the UI interactions and model API calls

// Sample articles for testing
const sampleArticles = {
    climate1: `Global warming fail: Study finds melting sea ice is actually helping Arctic animals

Proponents of the theory humans are primarily responsible for rising global temperatures long claimed wildlife are harmed significantly by global warming, and that unless mankind stops producing significant amounts of carbon-dioxide emissions, the world's animals will not be able to thrive.

While rising temperatures have certainly put a strain on species in some parts of the world, a new study by researchers at the University of Southern Denmark suggests animals in the Arctic region are thriving because of higher global temperatures.

USA Today recently declared the loss of sea ice "terrifying," but global warming skeptics have long suggested these claims are overblown when put into perspective.

The study, published in the journal Global Change Biology, found that Arctic foxes, polar bears, and seals have actually benefited from reduced ice coverage, as it has opened up new hunting grounds and food sources that were previously inaccessible.`,

    climate2: `Climate Crisis Accelerates: Scientists Warn of Irreversible Damage as Global Temperatures Soar

Leading climate scientists from around the world issued an urgent warning today that the planet is approaching critical tipping points that could trigger irreversible environmental collapse. The latest data shows global temperatures have risen faster than previously predicted, with devastating consequences for vulnerable communities worldwide.

Dr. Sarah Chen, lead researcher at the International Climate Research Institute, emphasized that immediate action is needed to prevent catastrophic outcomes. "We are witnessing unprecedented changes in our climate system," Chen stated. "The window for meaningful action is rapidly closing."

The report highlights how marginalized communities, particularly in developing nations, are bearing the brunt of climate impacts despite contributing least to the problem. Rising sea levels threaten to displace millions of people, while extreme weather events destroy homes and livelihoods.

Environmental activists are calling for governments to declare a climate emergency and implement radical changes to energy systems. "We cannot continue with business as usual while our planet burns," said Maria Rodriguez, spokesperson for Climate Action Now.`,

    covid1: `Government Announces New COVID-19 Restrictions to Protect Public Health

Prime Minister announced today a comprehensive package of new health measures designed to slow the spread of COVID-19 and protect the most vulnerable members of our society. The measures, developed in consultation with leading health experts, will come into effect next week.

"These difficult but necessary steps will help us get through this challenging period together," the Prime Minister said during a press conference. "We have a responsibility to protect each other, especially our elderly citizens and those with underlying health conditions."

The new restrictions include limits on public gatherings, enhanced safety protocols for businesses, and increased support for healthcare workers on the front lines. Health officials emphasized that these measures are temporary and will be regularly reviewed based on scientific evidence.

Dr. James Wilson, Chief Medical Officer, explained that the government's approach is guided by the best available science and international best practices. "We are taking a measured, evidence-based approach to protect public health while minimizing economic disruption," Wilson stated.

Citizens are encouraged to follow public health guidelines, including wearing masks, maintaining physical distance, and getting vaccinated when eligible.`
};

// Model configuration - YOU WILL REPLACE THESE WITH YOUR ACTUAL MODEL DETAILS
const MODEL_CONFIG = {
    // Replace with your actual API endpoint
    apiEndpoint: 'YOUR_MODEL_API_ENDPOINT_HERE',
    
    // Replace with your API key if needed
    apiKey: 'YOUR_API_KEY_HERE',
    
    // Model parameters
    maxTokens: 2048,
    temperature: 0.1,
    
    // Enable mock mode for testing (set to false when using real model)
    mockMode: true
};

// Prompts for your model - CUSTOMIZE THESE BASED ON YOUR MODEL
const MODEL_PROMPTS = {
    systemPrompt: `You are an expert in narrative framing analysis. Analyze the given news article and identify the narrative framing components according to the framework described in the research paper "Narrative Media Framing in Political Discourse".

Your task is to identify:
1. Hero (entities portrayed positively)
2. Villain (entities portrayed negatively) 
3. Victim (entities portrayed as suffering)
4. Focus (whether the narrative focuses on hero, villain, or victim)
5. Conflict type (fuel conflict, fuel resolution, prevent conflict, prevent resolution)
6. Cultural story (individualistic, hierarchical, egalitarian, fatalistic)

Provide your analysis in JSON format with confidence scores (0-100) for each prediction.`,

    analysisPrompt: (article) => `Please analyze the following news article for narrative framing components:

Article:
"""
${article}
"""

Provide your analysis in the following JSON format:
{
    "hero": {
        "prediction": "specific entity or group",
        "confidence": 85
    },
    "villain": {
        "prediction": "specific entity or group", 
        "confidence": 90
    },
    "victim": {
        "prediction": "specific entity or group",
        "confidence": 75
    },
    "focus": {
        "prediction": "hero|villain|victim",
        "confidence": 80
    },
    "conflict": {
        "prediction": "fuel_conflict|fuel_resolution|prevent_conflict|prevent_resolution",
        "confidence": 70
    },
    "cultural_story": {
        "prediction": "individualistic|hierarchical|egalitarian|fatalistic",
        "confidence": 85
    },
    "overall_confidence": 82,
    "explanation": "Brief explanation of the analysis and key indicators that led to these predictions."
}`
};

// DOM elements
let elements = {};

// Initialize the demo when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    setupEventListeners();
    console.log('Demo initialized');
});

function initializeElements() {
    elements = {
        sampleSelect: document.getElementById('sample-select'),
        loadSampleBtn: document.getElementById('load-sample'),
        articleInput: document.getElementById('article-input'),
        analyzeBtn: document.getElementById('analyze-btn'),
        clearBtn: document.getElementById('clear-btn'),
        resultsContainer: document.getElementById('results-container'),
        btnText: document.querySelector('.btn-text'),
        btnLoading: document.querySelector('.btn-loading')
    };
}

function setupEventListeners() {
    // Load sample article
    elements.loadSampleBtn.addEventListener('click', loadSampleArticle);
    
    // Analyze article
    elements.analyzeBtn.addEventListener('click', analyzeArticle);
    
    // Clear input
    elements.clearBtn.addEventListener('click', clearInput);
    
    // Auto-resize textarea
    elements.articleInput.addEventListener('input', autoResizeTextarea);
}

function loadSampleArticle() {
    const selectedSample = elements.sampleSelect.value;
    if (selectedSample && sampleArticles[selectedSample]) {
        elements.articleInput.value = sampleArticles[selectedSample];
        autoResizeTextarea();
        
        // Show success message
        showMessage('Sample article loaded successfully!', 'success');
    } else {
        showMessage('Please select a sample article first.', 'error');
    }
}

function clearInput() {
    elements.articleInput.value = '';
    elements.sampleSelect.value = '';
    elements.resultsContainer.innerHTML = `
        <div class="no-results">
            <div class="no-results-icon">🔍</div>
            <p>Enter an article above and click "Analyze Article" to see the narrative framing predictions.</p>
        </div>
    `;
    autoResizeTextarea();
}

function autoResizeTextarea() {
    const textarea = elements.articleInput;
    textarea.style.height = 'auto';
    textarea.style.height = Math.max(300, textarea.scrollHeight) + 'px';
}

async function analyzeArticle() {
    const articleText = elements.articleInput.value.trim();
    
    if (!articleText) {
        showMessage('Please enter an article to analyze.', 'error');
        return;
    }
    
    if (articleText.length < 50) {
        showMessage('Please enter a longer article (at least 50 characters) for better analysis.', 'error');
        return;
    }
    
    // Show loading state
    setLoadingState(true);
    
    try {
        // Call your model API
        const results = await callModelAPI(articleText);
        
        // Display results
        displayResults(results);
        
    } catch (error) {
        console.error('Analysis error:', error);
        showMessage('An error occurred during analysis. Please try again.', 'error');
    } finally {
        setLoadingState(false);
    }
}

// REPLACE THIS FUNCTION WITH YOUR ACTUAL MODEL API CALL
async function callModelAPI(articleText) {
    if (MODEL_CONFIG.mockMode) {
        // Mock response for testing - replace with actual API call
        return await mockModelResponse(articleText);
    }
    
    // ACTUAL API CALL - CUSTOMIZE THIS FOR YOUR MODEL
    try {
        const response = await fetch(MODEL_CONFIG.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MODEL_CONFIG.apiKey}`, // if needed
            },
            body: JSON.stringify({
                prompt: MODEL_PROMPTS.analysisPrompt(articleText),
                max_tokens: MODEL_CONFIG.maxTokens,
                temperature: MODEL_CONFIG.temperature,
                // Add other parameters your model needs
            })
        });
        
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Parse the model response - CUSTOMIZE THIS BASED ON YOUR MODEL'S OUTPUT FORMAT
        return parseModelResponse(data);
        
    } catch (error) {
        console.error('Model API error:', error);
        throw error;
    }
}

// CUSTOMIZE THIS FUNCTION TO PARSE YOUR MODEL'S RESPONSE FORMAT
function parseModelResponse(apiResponse) {
    // This depends on your model's output format
    // Example for OpenAI-style response:
    // const content = apiResponse.choices[0].message.content;
    // return JSON.parse(content);
    
    // Example for Hugging Face response:
    // return JSON.parse(apiResponse.generated_text);
    
    // Customize based on your model's response structure
    return apiResponse;
}

// Mock response for testing - remove when using real model
async function mockModelResponse(articleText) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock predictions based on article content
    const isClimateSkeptical = articleText.toLowerCase().includes('global warming fail') || 
                              articleText.toLowerCase().includes('skeptics');
    
    const isClimateActivist = articleText.toLowerCase().includes('climate crisis') || 
                             articleText.toLowerCase().includes('environmental activists');
    
    const isGovernmentCovid = articleText.toLowerCase().includes('government') && 
                             articleText.toLowerCase().includes('covid');
    
    if (isClimateSkeptical) {
        return {
            hero: { prediction: "Climate skeptics and researchers", confidence: 88 },
            villain: { prediction: "Climate advocates and mainstream media", confidence: 92 },
            victim: { prediction: "General public (implied)", confidence: 65 },
            focus: { prediction: "hero", confidence: 85 },
            conflict: { prediction: "prevent_resolution", confidence: 80 },
            cultural_story: { prediction: "individualistic", confidence: 90 },
            overall_confidence: 83,
            explanation: "This article frames climate skeptics as heroes providing 'objective' science against alarmist claims. It portrays climate advocates as villains spreading fear, while suggesting an individualistic narrative that nature is self-regulating."
        };
    } else if (isClimateActivist) {
        return {
            hero: { prediction: "Climate scientists and activists", confidence: 95 },
            villain: { prediction: "Governments and fossil fuel interests", confidence: 85 },
            victim: { prediction: "Vulnerable communities and future generations", confidence: 90 },
            focus: { prediction: "victim", confidence: 88 },
            conflict: { prediction: "fuel_resolution", confidence: 92 },
            cultural_story: { prediction: "egalitarian", confidence: 87 },
            overall_confidence: 89,
            explanation: "This article frames climate scientists and activists as heroes fighting for urgent action. It emphasizes victims (vulnerable communities) and promotes collective action (egalitarian cultural story) to address the crisis."
        };
    } else if (isGovernmentCovid) {
        return {
            hero: { prediction: "Government and health officials", confidence: 90 },
            villain: { prediction: "COVID-19 virus (implied)", confidence: 70 },
            victim: { prediction: "Vulnerable populations and elderly", confidence: 85 },
            focus: { prediction: "hero", confidence: 82 },
            conflict: { prediction: "fuel_resolution", confidence: 88 },
            cultural_story: { prediction: "hierarchical", confidence: 85 },
            overall_confidence: 83,
            explanation: "This article frames government and health officials as heroes taking necessary action to protect public health. It reflects a hierarchical cultural story emphasizing institutional authority and collective compliance with official guidelines."
        };
    } else {
        return {
            hero: { prediction: "Not clearly identified", confidence: 45 },
            villain: { prediction: "Not clearly identified", confidence: 40 },
            victim: { prediction: "Not clearly identified", confidence: 35 },
            focus: { prediction: "unclear", confidence: 30 },
            conflict: { prediction: "unclear", confidence: 25 },
            cultural_story: { prediction: "unclear", confidence: 20 },
            overall_confidence: 32,
            explanation: "The narrative framing components are not clearly identifiable in this article. The text may not contain sufficient narrative elements or may require a longer sample for accurate analysis."
        };
    }
}

function displayResults(results) {
    const template = document.getElementById('results-template');
    const clone = template.content.cloneNode(true);
    
    // Update confidence indicator
    const confidenceFill = clone.querySelector('.confidence-fill');
    const confidenceValue = clone.querySelector('.confidence-value');
    confidenceFill.style.width = `${results.overall_confidence}%`;
    confidenceValue.textContent = `${results.overall_confidence}%`;
    
    // Update prediction cards
    updatePredictionCard(clone, 'hero', results.hero);
    updatePredictionCard(clone, 'villain', results.villain);
    updatePredictionCard(clone, 'victim', results.victim);
    updatePredictionCard(clone, 'focus', results.focus);
    updatePredictionCard(clone, 'conflict', results.conflict);
    updatePredictionCard(clone, 'cultural', results.cultural_story);
    
    // Update detailed analysis
    const analysisText = clone.querySelector('.analysis-text');
    analysisText.textContent = results.explanation || 'No detailed explanation provided.';
    
    // Replace results container content
    elements.resultsContainer.innerHTML = '';
    elements.resultsContainer.appendChild(clone);
    
    // Scroll to results
    elements.resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function updatePredictionCard(container, cardType, prediction) {
    const card = container.querySelector(`.${cardType}-card`);
    if (card && prediction) {
        const valueElement = card.querySelector('.prediction-value');
        const confidenceElement = card.querySelector('.prediction-confidence');
        
        valueElement.textContent = formatPrediction(prediction.prediction);
        confidenceElement.textContent = `Confidence: ${prediction.confidence}%`;
        
        // Add confidence-based styling
        if (prediction.confidence >= 80) {
            card.style.borderColor = '#4caf50';
        } else if (prediction.confidence >= 60) {
            card.style.borderColor = '#ff9800';
        } else {
            card.style.borderColor = '#f44336';
        }
    }
}

function formatPrediction(prediction) {
    if (!prediction) return 'Not identified';
    
    // Format prediction text for display
    return prediction
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
}

function setLoadingState(isLoading) {
    elements.analyzeBtn.disabled = isLoading;
    
    if (isLoading) {
        elements.btnText.style.display = 'none';
        elements.btnLoading.style.display = 'inline-flex';
    } else {
        elements.btnText.style.display = 'inline';
        elements.btnLoading.style.display = 'none';
    }
}

function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.error-message, .success-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'error' ? 'error-message' : 'success-message';
    messageDiv.textContent = message;
    
    // Insert after input actions
    const inputActions = document.querySelector('.input-actions');
    inputActions.parentNode.insertBefore(messageDiv, inputActions.nextSibling);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        callModelAPI,
        parseModelResponse,
        formatPrediction
    };
}
