'use strict';

import { window, workspace, commands, ExtensionContext, Uri } from 'vscode';
import { LanguageClient, LanguageClientOptions, StreamInfo, Position as LSPosition, Location as LSLocation, Executable, ServerOptions, TransportKind } from 'vscode-languageclient/node';
import path = require('path');
import child_process = require('child_process');
import * as vscode from "vscode";
import * as fs from "node:fs";

let lc: LanguageClient;


export function activate(context: ExtensionContext) {
  const configuration = vscode.workspace.getConfiguration()
  const pathToVaLSeExec: string | undefined = configuration.get('niva.valse');
  const useLsp: boolean | undefined = configuration.get('niva.useLSP');
  const workspaceFolder = workspace.workspaceFolders.length == 1 ? workspace.workspaceFolders[0] : undefined


  let clientOptions: LanguageClientOptions = {
    documentSelector: ['niva'],
    synchronize: {
      // fileEvents: workspace.createFileSystemWatcher('**/*.niva')
			fileEvents: workspace.createFileSystemWatcher('**/.clientrc'),
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


  const showInfoNotification = vscode.commands.registerCommand('niva.install', async () => {
      const value = await vscode.window.showQuickPick(['yes', 'no', 'maybe'], { placeHolder: 'Wanna install niva?' });
      if (value === "yes") {
        vscode.window.showInformationMessage("Installing...")
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

          const p = new Promise<void>(resolve => {
            setTimeout(() => {
              resolve();
            }, 5000);
          });

          return p;
        });
      }
  });
  context.subscriptions.push(showInfoNotification)

  const needTurnOnLSP = useLsp && pathToVaLSeExec && !pathToVaLSeExec.startsWith("go to") && fs.existsSync(pathToVaLSeExec)


  if (needTurnOnLSP) {
    vscode.window.showInformationMessage("vaLSe is found!")

    const isWindows = process.platform === "win32";
    // const command = isWindows ? "cmd.exe" : "sh";
    const winPathToBat = pathToVaLSeExec.endsWith(".bat") ? pathToVaLSeExec : pathToVaLSeExec + ".bat"

    const command = isWindows ? winPathToBat : "sh";
    const args = isWindows ? [] : [pathToVaLSeExec]; // "/c", winPathToBat

    let javaServerOptions: ServerOptions = {
      run: { command, args },
      debug: { command, args }
    };

    // Create the language client and start the client.
    lc = new LanguageClient(
        'niva Lang Server',
        javaServerOptions,
        clientOptions
    );


    lc.info("workspace.workspaceFolders = " + workspace.workspaceFolders[0].uri);
    lc.info(context.extensionPath);
    lc.info("Starting vaLSe...");

    // lc.setTrace(Trace.Verbose); // this only throw exception from eclipse
    lc.start();
  } else {
    vscode.window.showInformationMessage("vaLSe not found, specify it from extension settings")
  }

}

export function deactivate() {
  return lc.stop();
}
