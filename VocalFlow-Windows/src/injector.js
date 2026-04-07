const clipboardy = require('clipboardy');
const { keyboard, Key } = require('@nut-tree-fork/nut-js');

/**
 * Pastes text to the active window cursor
 * @param {string} text 
 */
async function injectText(text) {
    if (!text || text.trim() === '') return;

    try {
        // Save current clipboard context
        const oldClipboard = await clipboardy.read();

        // Write new text to clipboard
        await clipboardy.write(text);

        console.log(`Injecting text: "${text}"`);

        // Simulate CTRL+V to paste
        // nut-js does not currently run on global wait hooks simultaneously easily if single threaded,
        // but since hotkey hook is native async it usually works out.
        await keyboard.pressKey(Key.LeftControl);
        await keyboard.pressKey(Key.V);
        await keyboard.releaseKey(Key.V);
        await keyboard.releaseKey(Key.LeftControl);

        // Optional: restore clipboard after a small delay
        setTimeout(async () => {
            try {
                await clipboardy.write(oldClipboard);
            } catch (e) {
                // ignore
            }
        }, 500);

    } catch (e) {
        console.error("Failed to inject text:", e);
    }
}

module.exports = {
    injectText
};
