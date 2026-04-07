const { uIOhook, UiohookKey } = require('uiohook-napi');
const { getDeepgramBalance, getGroqBalance, processTextWithGroq } = require('./api');
const { startRecording, stopRecording } = require('./audio');
const { injectText } = require('./injector');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

// Helper to map string to uiohook key
function getRecordKey() {
    const keyString = config.hotkeys.recordKey || "Right Alt";
    if (keyString === "Right Alt") return UiohookKey.AltRight;
    if (keyString === "Left Alt") return UiohookKey.Alt;
    if (keyString === "Right Ctrl") return UiohookKey.CtrlRight;
    if (keyString === "Left Ctrl") return UiohookKey.Ctrl;
    return UiohookKey.AltRight; // default
}

const TARGET_KEY = getRecordKey();
let isRecording = false;

// We store the full transcript during one session, Deepgram gives partial/final chunks
let currentTranscript = "";

async function onFinalTranscript(text) {
    if (text) {
        currentTranscript += " " + text;
    }
}

uIOhook.on('keydown', (e) => {
    if (e.keycode === TARGET_KEY && !isRecording) {
        isRecording = true;
        currentTranscript = "";
        console.log(">>> Recording Started... [Speak Now]");
        startRecording(onFinalTranscript);
    }
});

uIOhook.on('keyup', async (e) => {
    if (e.keycode === TARGET_KEY && isRecording) {
        isRecording = false;
        console.log("<<< Recording Stopped. Processing...");
        stopRecording();
        
        // Let audio stream flush the final chunk with a small delay
        setTimeout(async () => {
            const rawText = currentTranscript.trim();
            if (rawText) {
                console.log(`Raw Transcript: "${rawText}"`);
                console.log(`Processing with Groq...`);
                const processed = await processTextWithGroq(rawText);
                console.log(`Final Text: "${processed}"`);
                await injectText(processed);
            } else {
                console.log("No speech detected.");
            }
        }, 1000);
    }
});

async function main() {
    console.log("===================================");
    console.log(" VocalFlow Windows (Node.js Port) ");
    console.log("===================================");
    
    // Fetch and show balances
    const dgBalance = await getDeepgramBalance();
    const grBalance = await getGroqBalance();

    console.log(`Deepgram Balance: ${dgBalance}`);
    console.log(`Groq Balance:     ${grBalance}`);
    console.log("===================================");
    console.log(`Setup complete. Hold [${config.hotkeys.recordKey}] to record and transcribe.`);
    
    // Start global keystroke listener
    uIOhook.start();
}

main().catch(err => {
    console.error("Critical error in main loop:", err);
});
