const record = require('node-record-lpcm16');
const { createDeepgramStream } = require('./api');

// Global microphone recording instance
let recording = null;
let liveStream = null;

/**
 * Starts recording audio and streams it to Deepgram
 * @param {Function} onTranscript Callback when transcript is received
 */
function startRecording(onTranscript) {
    if (recording) {
        console.log("Already recording.");
        return;
    }

    try {
        console.log("Starting Deepgram connection...");
        liveStream = createDeepgramStream(onTranscript);

        // Wait for WebSocket to open
        liveStream.on('open', () => {
             console.log("Deepgram connected. Listening to microphone...");
             recording = record.record({
                sampleRate: 16000,
                channels: 1,
                threshold: 0,
                endOnSilence: false
             });

             recording.stream()
                .on('data', (data) => {
                    const isReady = liveStream.getReadyState() === 1; // 1 is WebSocket OPEN
                    if (isReady) {
                        try {
                            liveStream.send(data);
                        } catch (e) {
                            console.error("Error sending data to Deepgram", e.message);
                        }
                    }
                })
                .on('error', (err) => {
                     console.error("Microphone error:", err);
                });
        });

        liveStream.on('error', (err) => {
            console.error("Deepgram WebSocket Error:", err);
        });

        liveStream.on('close', () => {
            console.log("Deepgram connection closed.");
        });

    } catch (e) {
        console.error("Failed to start recording:", e.message);
    }
}

/**
 * Stops recording and closes WebSocket
 */
function stopRecording() {
    if (recording) {
        recording.stop();
        recording = null;
        console.log("Microphone stopped.");
    }
    
    if (liveStream) {
        // give it a tiny bit to flush
        setTimeout(() => {
            liveStream.requestClose();
            liveStream = null;
            console.log("Streaming closed.");
        }, 500);
    }
}

module.exports = {
    startRecording,
    stopRecording
};
