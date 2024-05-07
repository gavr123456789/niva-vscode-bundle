'use strict';

import * as net from 'net';

import { Trace } from 'vscode-jsonrpc';
import { window, workspace, commands, ExtensionContext, Uri } from 'vscode';
import { LanguageClient, LanguageClientOptions, StreamInfo, Position as LSPosition, Location as LSLocation, Executable, ServerOptions, TransportKind } from 'vscode-languageclient/node';
import path = require('path');
import child_process = require('child_process');

let lc: LanguageClient;

let shThatRunsJar = '/home/gavr/Documents/Projects/Fun/lsp/nivals/build/distributions/nivals-1.0-SNAPSHOT/bin/nivals'

let nativePath = '/home/gavr/Documents/Projects/Fun/lsp/nivals/build/distributions/nivals-1.0-SNAPSHOT/lib/nivalsnative'

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


export function activate(context: ExtensionContext) {

  let runEnvironment = { ...process.env };

  let runExe: Executable = {
    command: "/home/gavr/.niva/bin/nivalsnative",
    // args: [runCommand],
    options: {
      env: runEnvironment
      // shell: true
    },
    // transport: TransportKind.stdio
  };

  let runExe2: Executable = {
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

  let serverOptions2: ServerOptions = {
    run: runExe,
    debug: runExe
  };

  let clientOptions: LanguageClientOptions = {
    documentSelector: ['niva'],
    synchronize: {
      fileEvents: workspace.createFileSystemWatcher('**/*.niva')
    }
  };



  // Create the language client and start the client.
  lc = new LanguageClient('niva Lang Server', serverOptions2, clientOptions);

  lc.info("hallo from niva vsc extension");
  lc.info(context.extensionPath);

  lc.setTrace(Trace.Verbose);
  // lc.start();
}

export function deactivate() {
  return lc.stop();
}
