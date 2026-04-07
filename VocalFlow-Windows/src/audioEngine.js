// audioEngine.js

class AudioEngine {
    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.stream = null;
    }

    async init() {
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(this.stream);

        this.mediaRecorder.ondataavailable = (event) => {
            this.audioChunks.push(event.data);
        };
    }

    startRecording() {
        if (this.mediaRecorder) {
            this.audioChunks = [];
            this.mediaRecorder.start();
        }
    }

    stopRecording() {
        return new Promise((resolve) => {
            if (this.mediaRecorder) {
                this.mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(this.audioChunks);
                    const audioUrl = URL.createObjectURL(audioBlob);
                    resolve(audioUrl);
                };
                this.mediaRecorder.stop();
            }
        });
    }
}

export default AudioEngine;