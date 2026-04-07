// textInjector.js

/**
 * Cliptboard and Text Injection Module
 * This module provides functionality to inject text from the clipboard into specified inputs.
 */

// Function to get text from clipboard
async function getTextFromClipboard() {
    try {
        const text = await navigator.clipboard.readText();
        return text;
    } catch (err) {
        console.error('Failed to read clipboard contents: ', err);
        return '';
    }
}

// Function to inject text into a specified input element
function injectText(inputElement) {
    getTextFromClipboard().then(text => {
        inputElement.value = text;
    });
}

// Exporting functions if used in modules
export { getTextFromClipboard, injectText };