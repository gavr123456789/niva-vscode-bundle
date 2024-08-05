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

  const needTurnOnLSP = useLsp && pathToVaLSeExec && !pathToVaLSeExec.startsWith("go to") && fs.existsSync(pathToVaLSeExec)


  if (needTurnOnLSP) {
    vscode.window.showInformationMessage("vaLSe is found!")

    let javaServerOptions: ServerOptions = {
      run: {command: "sh", args: [pathToVaLSeExec]},
      debug: {command: "sh", args: [pathToVaLSeExec]}
    }
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
