const { windowManager } = require("node-window-manager");
const applescript = require("applescript");
const fs = require("fs");
const constants = require("./constants");
const script = fs.readFileSync("./monitorSize.scpt", {encoding: "utf-8"});


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
const apps = parseArgv(argv);


(async () => {
    const monitorSize = await getMonitorSize();
    const [_, __, width, height] = monitorSize;
    const windows = windowManager.getWindows();

    windows.forEach((window)=> {
        console.log(window.getTitle());
        window.setBounds({ x: 0, y: 0, width, height });
    });
})();
