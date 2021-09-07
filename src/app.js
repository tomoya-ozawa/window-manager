const { windowManager } = require("node-window-manager");
const applescript = require("applescript");
const fs = require("fs");
const constants = require("./constants");
const script = fs.readFileSync(__dirname + "/monitorSize.scpt", {encoding: "utf-8"});

// ---------------------functions---------------------

const parseArgv = (argv) => {
    const aliasesMap = {};
    const aliases = [];
    Object.keys(constants.apps).forEach(key => {
        const alias = constants.apps[key].alias;
        aliases.push(alias);
        aliasesMap[alias] = key
    });

    const regex = aliases.reduce((prev, current, i) => {
        prev = prev + `(${current})`
        if (i !== aliases.length - 1) prev = prev + '|'
        return prev;
    }, '');
    
    const matches = argv.match(new RegExp(regex, 'g'));
    return matches.map(alias => aliasesMap[alias])
}

const getMonitorSize = () => {
    return new Promise((resolve)=>{
        applescript.execString(script, (err, output) => {
            resolve(output)
        });
    })
}

// ---------------------main---------------------

// This method has to be called on macOS before changing the window's bounds, otherwise it will throw an error.
// It will prompt an accessibility permission request dialog, if needed.
windowManager.requestAccessibility();

const argv = process.argv[2];
if (!argv) return;


(async () => {
    const apps = parseArgv(argv);
    const monitorSize = await getMonitorSize();
    const [_, __, width, height] = monitorSize;
    const windows = windowManager.getWindows();

    const appWidth = width / apps.length;
    apps.forEach((app, i) => {
        const appTitle = constants.apps[app].windowTitle;
        windows.forEach((window)=> {
            const title = window.getTitle();
            if (appTitle === title) {
                window.bringToTop();
                window.setBounds({ x: appWidth * i, y: 0, width: appWidth, height });
            }
        });
    })

})();
