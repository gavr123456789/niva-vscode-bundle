'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode_1 = require("vscode");
const node_1 = require("vscode-languageclient/node");
let lc;
let shKotinMy = '/home/gavr/Documents/Projects/Fun/lsp/vaLSe/build/install/nivals/bin/nivals';
function activate(context) {
    // let runEnvironment = { ...process.env };
    // let runExe: Executable = {
    //   command: "/home/gavr/.niva/bin/nivalsnative",
    //   // args: [runCommand],
    //   options: {
    //     env: runEnvironment
    //     // shell: true
    //   },
    //   // transport: TransportKind.stdio
    // };
    let clientOptions = {
        documentSelector: ['niva'],
        synchronize: {
            // fileEvents: workspace.createFileSystemWatcher('**/*.niva')
            fileEvents: vscode_1.workspace.createFileSystemWatcher('**/.clientrc'),
        },
        workspaceFolder: vscode_1.workspace.workspaceFolders[0]
    };
    let javaServerOptions = {
        run: { command: "sh", args: [shKotinMy] },
        debug: { command: "sh", args: [shKotinMy] }
    };
    // Create the language client and start the client.
    lc = new node_1.LanguageClient('niva Lang Server', javaServerOptions, clientOptions);
    lc.info("hallo from niva vsc extension4");
    lc.info("workspace.workspaceFolders = " + vscode_1.workspace.workspaceFolders[0].uri);
    lc.info(context.extensionPath);
    // lc.setTrace(Trace.Verbose); // this only throw exception from eclipse
    lc.start();
}
exports.activate = activate;
function deactivate() {
    return lc.stop();
}
exports.deactivate = deactivate;
