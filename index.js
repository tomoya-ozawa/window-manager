const { windowManager } = require("node-window-manager");
const constants = require("./constants");
console.log(constants)
// This method has to be called on macOS before changing the window's bounds, otherwise it will throw an error.
// It will prompt an accessibility permission request dialog, if needed.
windowManager.requestAccessibility();

const windows = windowManager.getWindows();

windows.forEach((window)=> {
    console.log(window.getTitle());
    window.setBounds({ x: 0, y: 0 });
})

// Prints the currently focused window bounds.

// Sets the active window's bounds.
