const { createClient } = require('@deepgram/sdk');
const Groq = require('groq-sdk');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

const deepgram = createClient(config.deepgram.apiKey);
const groq = new Groq({ apiKey: config.groq.apiKey });

/**
 * Fetch Deepgram Balance
 */
async function getDeepgramBalance() {
    try {
        const url = `https://api.deepgram.com/v1/projects/${config.deepgram.projectId}/balances`;
        const response = await axios.get(url, {
            headers: {
                Authorization: `Token ${config.deepgram.apiKey}`,
            },
        });
        
        if (response.data && response.data.balances && response.data.balances.length > 0) {
            const balance = response.data.balances[0];
            return `$${balance.amount.toFixed(2)}`;
        }
        return "Not Available or $0.00";
    } catch (error) {
        return "Error fetching balance (Invalid key or project ID)";
    }
}

/**
 * Fetch Groq Balance
 * Note: Groq does not currently provide a public REST API for real-time balance logic via simple API keys easily, 
 * but we attempt to fetch billing or usage mock/warning. We will just return a mocked status since public billing API is restricted.
 */
async function getGroqBalance() {
    // Note: Due to Groq API limitation, billing info is usually in dashboard, not public SDK. 
    // We will show a placeholder unless a future endpoint is added.
    return "Check Dashboard (No public SDK billing endpoint)";
}

/**
 * Setup Deepgram WebSocket connection for streaming
 * @param {Function} onTranscript - Callback when final transcript string is received
 */
function createDeepgramStream(onTranscript) {
    const live = deepgram.listen.live({
        model: 'nova-2',
        language: 'en-US',
        smart_format: true,
        endpointing: 300, 
    });

    live.on('message', (message) => {
        const received = JSON.parse(message);
        if (received.channel && received.channel.alternatives && received.channel.alternatives.length > 0) {
            const transcript = received.channel.alternatives[0].transcript;
            if (transcript && received.is_final) {
                onTranscript(transcript);
            }
        }
    });

    return live;
}

/**
 * Post-Process text with Groq (fixing grammar, spelling)
 */
async function processTextWithGroq(text) {
    if (!config.groq.postProcessing.grammarCorrection) return text;
    if (!text.trim()) return text;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You are a dictation assistant. Fix spelling and grammar of the provided text. Return ONLY the corrected text. Do NOT add conversational filler.'
                },
                {
                    role: 'user',
                    content: text
                }
            ],
            model: config.groq.model || 'llama3-8b-8192',
            temperature: 0.1
        });
        return completion.choices[0].message.content.trim();
    } catch (error) {
        console.error("Groq Processing Error:", error.message);
        return text; // fallback to original text
    }
}

module.exports = {
    getDeepgramBalance,
    getGroqBalance,
    createDeepgramStream,
    processTextWithGroq
};
