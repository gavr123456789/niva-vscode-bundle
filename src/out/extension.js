'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode_jsonrpc_1 = require("vscode-jsonrpc");
const vscode_1 = require("vscode");
const node_1 = require("vscode-languageclient/node");
let lc;
let shThatRunsJar = '/home/gavr/Documents/Projects/Fun/lsp/nivals/build/distributions/nivals-1.0-SNAPSHOT/bin/nivals';
let shThatRunsJar_notMy = '/home/gavr/Documents/Projects/Fun/lsp/vscode-extension-samples/lsp-sample/java-server/app/build/install/simpleJavaLanguageServer/bin/simpleJavaLanguageServer';
let shKotinMy = '/home/gavr/Documents/Projects/Fun/lsp/nivals/build/install/nivals/bin/nivals';
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
            fileEvents: vscode_1.workspace.createFileSystemWatcher('**/.clientrc')
        }
    };
    let javaServerOptions = {
        run: { command: "sh", args: [shKotinMy] },
        debug: { command: "sh", args: [shKotinMy] }
    };
    // Create the language client and start the client.
    lc = new node_1.LanguageClient('niva Lang Server', javaServerOptions, clientOptions);
    lc.info("hallo from niva vsc extension3");
    lc.info(context.extensionPath);
    lc.setTrace(vscode_jsonrpc_1.Trace.Verbose);
    lc.start();
}
exports.activate = activate;
function deactivate() {
    return lc.stop();
}
exports.deactivate = deactivate;
