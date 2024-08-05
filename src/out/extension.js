'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode_1 = require("vscode");
const node_1 = require("vscode-languageclient/node");
const vscode = require("vscode");
const fs = require("node:fs");
let lc;
function activate(context) {
    vscode.window.showInformationMessage("HELLOOO");
    vscode.window.showInformationMessage("HELLOOO");
    vscode.window.showInformationMessage("HELLOOO");
    // vscode.window.showInformationMessage("Haloooo!")
    const configuration = vscode.workspace.getConfiguration();
    const pathToVaLSeExec = configuration.get('niva.valse');
    const useLsp = configuration.get('niva.useLSP');
    const workspaceFolder = vscode_1.workspace.workspaceFolders.length == 1 ? vscode_1.workspace.workspaceFolders[0] : undefined;
    let clientOptions = {
        documentSelector: ['niva'],
        synchronize: {
            // fileEvents: workspace.createFileSystemWatcher('**/*.niva')
            fileEvents: vscode_1.workspace.createFileSystemWatcher('**/.clientrc'),
        },
        workspaceFolder: workspaceFolder
    };
    const valseExist = fs.existsSync(pathToVaLSeExec);
    const needTurnOnLSP = useLsp && pathToVaLSeExec && !pathToVaLSeExec.startsWith("go to") && valseExist;
    if (needTurnOnLSP) {
        vscode.window.showInformationMessage("vaLSe is found!");
        let javaServerOptions = {
            run: { command: "sh", args: [pathToVaLSeExec] },
            debug: { command: "sh", args: [pathToVaLSeExec] }
        };
        // Create the language client and start the client.
        lc = new node_1.LanguageClient('niva Lang Server', javaServerOptions, clientOptions);
        lc.info("workspace.workspaceFolders = " + vscode_1.workspace.workspaceFolders[0].uri);
        lc.info(context.extensionPath);
        lc.info("Starting vaLSe...");
        // lc.setTrace(Trace.Verbose); // this only throw exception from eclipse
        lc.start();
    }
    else {
        vscode.window.showInformationMessage("vaLSe not found, specify it from extension settings");
    }
}
exports.activate = activate;
function deactivate() {
    return lc.stop();
}
exports.deactivate = deactivate;
