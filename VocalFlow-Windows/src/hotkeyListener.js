// hotkeyListener.js

const { globalShortcut } = require('electron');

class HotkeyListener {
    constructor() {
        this.shortcuts = new Map();
    }

    registerShortcut(hotkey, callback) {
        if (this.shortcuts.has(hotkey)) {
            console.log(`Hotkey ${hotkey} is already registered.`);
            return;
        }

        this.shortcuts.set(hotkey, callback);
        globalShortcut.register(hotkey, () => callback());
        console.log(`Registered hotkey: ${hotkey}`);
    }

    unregisterShortcut(hotkey) {
        if (!this.shortcuts.has(hotkey)) {
            console.log(`Hotkey ${hotkey} is not registered.`);
            return;
        }

        globalShortcut.unregister(hotkey);
        this.shortcuts.delete(hotkey);
        console.log(`Unregistered hotkey: ${hotkey}`);
    }

    unregisterAll() {
        this.shortcuts.forEach((_, hotkey) => this.unregisterShortcut(hotkey));
    }
}

module.exports = HotkeyListener;
