'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode_jsonrpc_1 = require("vscode-jsonrpc");
const vscode_1 = require("vscode");
const node_1 = require("vscode-languageclient/node");
let lc;
let shThatRunsJar = '/home/gavr/Documents/Projects/Fun/lsp/nivals/build/distributions/nivals-1.0-SNAPSHOT/bin/nivals';
let nativePath = '/home/gavr/Documents/Projects/Fun/lsp/nivals/build/distributions/nivals-1.0-SNAPSHOT/lib/nivalsnative';
// function spawnServer() {
//   let program = "bash"
//   let args = [
//     '/home/gavr/Documents/Projects/Fun/lsp/nivals/build/distributions/nivals-1.0-SNAPSHOT/bin/nivals',
//     '5007'
//   ]
//   let process = child_process.spawn(program, args)
//   process.stdout.on('data', (data) => {
//     lc.info(`stdout: ${data}`);
//   });
//   process.on('error', (err) => {
//     lc.info(`ERRRORRRR ${err.message}`)
//     lc.error('Failed to start subprocess' + args[0], null, "force")
//   });
// }
function activate(context) {
    let runEnvironment = Object.assign({}, process.env);
    let runExe = {
        command: "/home/gavr/.niva/bin/nivalsnative",
        // args: [runCommand],
        options: {
            env: runEnvironment
            // shell: true
        },
        // transport: TransportKind.stdio
    };
    let runExe2 = {
        command: shThatRunsJar,
    };
    // The server is a started as a separate app and listens on port 5007
    // let connectionInfo = {
    //   port: 5007
    // };
    // let serverOptions = () => {
    //   // Connect to language server via socket
    //   let socket = net.connect(connectionInfo);
    //   let result: StreamInfo = {
    //     writer: socket,
    //     reader: socket
    //   };
    //   return Promise.resolve(result);
    // };
    let serverOptions2 = {
        run: runExe,
        debug: runExe
    };
    let clientOptions = {
        documentSelector: ['niva'],
        synchronize: {
            fileEvents: vscode_1.workspace.createFileSystemWatcher('**/*.niva')
        }
    };
    // Create the language client and start the client.
    lc = new node_1.LanguageClient('niva Lang Server', serverOptions2, clientOptions);
    lc.info("hallo from niva vsc extension");
    lc.info(context.extensionPath);
    lc.setTrace(vscode_jsonrpc_1.Trace.Verbose);
    // lc.start();
}
exports.activate = activate;
function deactivate() {
    return lc.stop();
}
exports.deactivate = deactivate;
