// groqService.js

/**
 * Groq API Integration and Balance Checking Service
 * This service is responsible for handling API calls to the Groq service
 * and performing balance checks.
 */

class GroqService {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
    }

    async fetchBalance(userId) {
        try {
            const response = await fetch(`${this.apiUrl}/balance/${userId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok' + response.statusText);
            }
            const data = await response.json();
            return data.balance;
        } catch (error) {
            console.error('Error fetching balance:', error);
            throw error;
        }
    }

    async callGroqAPI(endpoint, userData) {
        try {
            const response = await fetch(`${this.apiUrl}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok' + response.statusText);
            }
            return await response.json();
        } catch (error) {
            console.error('Error calling Groq API:', error);
            throw error;
        }
    }
}

module.exports = GroqService;