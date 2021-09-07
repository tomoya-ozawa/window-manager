const { windowManager } = require("node-window-manager");
const applescript = require("applescript");
const fs = require("fs");
const constants = require("./constants");
const script = fs.readFileSync("./monitorSize.scpt", {encoding: "utf-8"});

// This method has to be called on macOS before changing the window's bounds, otherwise it will throw an error.
// It will prompt an accessibility permission request dialog, if needed.
windowManager.requestAccessibility();

const getMonitorSize = () => {
    return new Promise((resolve)=>{
        applescript.execString(script, (err, output) => {
            resolve(output)
        });
    })
}


(async () => {
    const monitorSize = await getMonitorSize();
    const [_, __, width, height] = monitorSize;
    const windows = windowManager.getWindows();
    
    windows.forEach((window)=> {
        console.log(window.getTitle());
        window.setBounds({ x: 0, y: 0, width, height });
    });
})();
