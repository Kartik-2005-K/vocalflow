const axios = require('axios');

class DeepgramService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://api.deepgram.com/v1/';
    }

    async transcribeAudio(audioUrl) {
        try {
            const response = await axios.post(`${this.baseURL}listen`, {
                url: audioUrl
            }, {
                headers: {
                    'Authorization': `Token ${this.apiKey}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error transcribing audio:', error);
            throw error;
        }
    }

    async balanceCheck() {
        try {
            const response = await axios.get(`${this.baseURL}usage`, {
                headers: {
                    'Authorization': `Token ${this.apiKey}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error checking balance:', error);
            throw error;
        }
    }
}

module.exports = DeepgramService;