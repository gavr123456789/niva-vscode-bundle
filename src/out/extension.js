'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode_1 = require("vscode");
const node_1 = require("vscode-languageclient/node");
const vscode = require("vscode");
const fs = require("node:fs");
let lc;
function activate(context) {
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
    // https://github.com/microsoft/vscode-extension-samples/blob/main/configuration-sample/src/extension.ts#L29
    // vscode.commands.registerCommand('config.commands.installNivaLangServer', async () => {
    //   const value = await vscode.window.showQuickPick(['yes', 'no', 'maybe'], { placeHolder: 'Wanna install niva?' });
    //   if (value === "yes") {
    //     vscode.window.showInformationMessage("Installing...")
    //   }
    // })
    const showInfoNotification = vscode.commands.registerCommand('niva.install', () => __awaiter(this, void 0, void 0, function* () {
        const value = yield vscode.window.showQuickPick(['yes', 'no', 'maybe'], { placeHolder: 'Wanna install niva?' });
        if (value === "yes") {
            vscode.window.showInformationMessage("Installing...");
            // progress bar
            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Installing...",
                cancellable: true
            }, (progress, token) => {
                token.onCancellationRequested(() => {
                    console.log("User canceled the long running operation");
                });
                progress.report({ increment: 0 });
                setTimeout(() => {
                    progress.report({ increment: 10, message: "Still going..." });
                }, 1000);
                setTimeout(() => {
                    progress.report({ increment: 40, message: "Still going even more..." });
                }, 2000);
                setTimeout(() => {
                    progress.report({ increment: 50, message: "I am long running! - almost there..." });
                }, 3000);
                const p = new Promise(resolve => {
                    setTimeout(() => {
                        resolve();
                    }, 5000);
                });
                return p;
            });
        }
    }));
    context.subscriptions.push(showInfoNotification);
    const needTurnOnLSP = useLsp && pathToVaLSeExec && !pathToVaLSeExec.startsWith("go to") && fs.existsSync(pathToVaLSeExec);
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
