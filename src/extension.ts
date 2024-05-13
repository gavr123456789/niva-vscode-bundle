'use strict';

import * as net from 'net';

import { Trace } from 'vscode-jsonrpc';
import { window, workspace, commands, ExtensionContext, Uri } from 'vscode';
import { LanguageClient, LanguageClientOptions, StreamInfo, Position as LSPosition, Location as LSLocation, Executable, ServerOptions, TransportKind } from 'vscode-languageclient/node';
import path = require('path');
import child_process = require('child_process');

let lc: LanguageClient;

let shThatRunsJar = '/home/gavr/Documents/Projects/Fun/lsp/nivals/build/distributions/nivals-1.0-SNAPSHOT/bin/nivals'


let shThatRunsJar_notMy = '/home/gavr/Documents/Projects/Fun/lsp/vscode-extension-samples/lsp-sample/java-server/app/build/install/simpleJavaLanguageServer/bin/simpleJavaLanguageServer'
let shKotinMy = '/home/gavr/Documents/Projects/Fun/lsp/nivals/build/install/nivals/bin/nivals'

export function activate(context: ExtensionContext) {

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

  let clientOptions: LanguageClientOptions = {
    documentSelector: ['niva'],
    synchronize: {
      // fileEvents: workspace.createFileSystemWatcher('**/*.niva')
			fileEvents: workspace.createFileSystemWatcher('**/.clientrc')

    }
  };


  let javaServerOptions: ServerOptions = {
    run: { command: "sh", args: [shKotinMy] },
    debug: { command: "sh", args: [shKotinMy] }
  }

  // Create the language client and start the client.
  lc = new LanguageClient(
    'niva Lang Server',
    javaServerOptions,
    clientOptions
  );

  lc.info("hallo from niva vsc extension3");
  lc.info(context.extensionPath);

  lc.setTrace(Trace.Verbose);
  lc.start();
}

export function deactivate() {
  return lc.stop();
}
