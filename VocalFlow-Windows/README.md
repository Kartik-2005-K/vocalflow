# VocalFlow for Windows (Node.js)

A lightweight CLI tool for Windows that lets you dictate into any text field using a hold-to-record hotkey.

## Features

- **Hold-to-record hotkey**: Configurable trigger (Right Alt by default).
- **Real-time streaming ASR**: Powered by Deepgram.
- **Deepgram Balance Check**: Shows account balance on startup.
- **Post-processing via Groq LLM**: Automatically corrects grammar and spelling.
- **Works uniformly**: Text is injected into the active application via clipboard + simulated paste (`Ctrl+V`).

## Requirements

1. **Node.js** (v18+ recommended)
2. **Deepgram API Key** & Project ID
3. **Groq API Key**
4. **Sox**: The `node-record-lpcm16` library requires `sox` for microphone access.
    - Windows users can download the Sox binaries and add the path to the Environment Variables.

## Configuration

Open the `config.json` file in the root folder and add your keys:

```json
{
  "deepgram": {
    "apiKey": "YOUR_DEEPGRAM_API_KEY",
    "projectId": "YOUR_DEEPGRAM_PROJECT_ID"
  },
  "groq": {
    "apiKey": "YOUR_GROQ_API_KEY",
    "model": "llama3-8b-8192",
    "postProcessing": {
      "grammarCorrection": true
    }
  },
  "hotkeys": {
    "recordKey": "Right Alt"
  }
}
```

## Installation

Since the codebase is delivered without `node_modules`, you must install everything:

```bash
npm install
```

## Running the Application

Start the listener in your terminal:

```bash
npm start
```

When you see the ready message:
1. Hold the **Right Alt** key (or your configured trigger).
2. Wait a split second, then speak into your microphone.
3. Release the key.
4. Your text will be post-processed for grammar, placed on your clipboard, and automatically pasted at your cursor location.

## Zipping Project (Without Node Modules)

Open a PowerShell terminal and run:

```powershell
npm run zip
```
*This invokes `build_zip.ps1` and outputs `VocalFlow-Windows-Release.zip` one folder above.*
