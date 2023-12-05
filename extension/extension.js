"use strict"

// Used for TypeScript JSDoc @types
const vscode = require('vscode')
const {
    window,
    Range,
    Diagnostic,
    DiagnosticSeverity,
    Position,
    Uri,
    ProgressLocation,
    workspace,
    HoverProvider,
    Hover
} = require('vscode')

const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')
const decorationType = window.createTextEditorDecorationType({
    textDecorationa: 'underline',
    after: { contentText: ')', color: '#999999' },
    before: { contentText: '(', color: '#999999' },
})
const decorationTypeN = window.createTextEditorDecorationType({})
const decorationTypeI = window.createTextEditorDecorationType({
    before: { contentText: 'if ', color: '#999999' },
})
const decorationTypeC = window.createTextEditorDecorationType({
    before: { contentText: 'case ', color: '#999999' },
})

const onDidChangeTextDocument = (documentChange) => {
    const document = documentChange.document
    const text = document.getText()

    let diagnostics = []
    const decorationsArray = []
    const decorationsArrayC = []
    const decorationsArrayI = []
    const openEditor = window.visibleTextEditors.filter(
        editor => editor.document.uri === document.uri
    )[0]

    var re = /[a-z]+:\s([a-zA-Z]+\s[a-zA-Z]+(\s[a-zA-Z]+)*)(\s|$)/g
    var conditions = /\|\s(.*\s=>\s)/g
    var switches = /\|\s/g
    let parsed = {
        line: 0, col: 0,
    }

    let match = null
    let cases = false
    for (const line of text.split('\n')) {
        while ((match = re.exec(line)) != null) {

            parsed.col = match.index + match[0].length - match[1].length - 1

            let errorWordlength = match[1].trim().length

            let range = new Range(
                parsed.line, parsed.col,
                parsed.line, parsed.col + errorWordlength
            )

            decorationsArray.push({
                range: range //new Range(new Position(line, 1024), new Position(line, 1024))
            })
        }

        let conded = false
        while ((match = conditions.exec(line)) != null) {
            parsed.col = match.index //+ match[0].length - match[1].length - 1
            conded = true

            let errorWordlength = 1 //match[1].length

            let range = new Range(
                parsed.line, parsed.col,
                parsed.line, parsed.col + errorWordlength
            )

            {
                (cases ? decorationsArrayC : decorationsArrayI).push({
                    range: range //new Range(new Position(line, 1024), new Position(line, 1024))
                })
            }
        }

        if (!conded) while ((match = switches.exec(line)) != null) {
            cases = true
        }

        parsed.line++
    }

    openEditor.setDecorations(decorationType, decorationsArray)
    openEditor.setDecorations(decorationTypeC, decorationsArrayC)
    openEditor.setDecorations(decorationTypeI, decorationsArrayI)
}

exports.activate = function (context) {
    const diagnostics = vscode.languages.createDiagnosticCollection('niva')
    context.subscriptions.push(diagnostics)

    console.log("[Niva-Lint] Initialized.")

    workspace.onDidChangeTextDocument(onDidChangeTextDocument)

    const sel = { scheme: 'file', language: 'niva' }

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('vsniva.helloWorld', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World from Niva!')
    })
    // context.subscriptions.push(disposable);

    const provider2 = vscode.languages.registerCompletionItemProvider(
        sel,
        {
            provideCompletionItems(document, position) {
                // get all text until the `position` and check if it reads `console.`
                // and if so then complete if `log`, `warn`, and `error`
                const linePrefix = document.lineAt(position).text.substr(0, position.character)
                if (!linePrefix.endsWith('gavr.')) {
                    return undefined
                }

                return [
                    new vscode.CompletionItem('log', vscode.CompletionItemKind.Method),
                    new vscode.CompletionItem('warn', vscode.CompletionItemKind.Method),
                    new vscode.CompletionItem('error', vscode.CompletionItemKind.Method),
                ]
            }
        },
        '.' // triggered whenever a '.' is being typed
    )

    const provider1 = vscode.languages.registerCompletionItemProvider(
        sel,
        {
            provideCompletionItems(document, position, token, context) {
                return new Promise((resolve, reject) => {
                    reject()
                })
            }
        }
    )

    /** @implements {vscode.DocumentSymbolProvider} */
    class NivaDocumentSymbolProvider {
        /**
        * @param {vscode.TextDocument} document
        */
        provideDocumentSymbols(
            document,
            token // vscode.CancellationToken
        )
        // Promise<vscode.DocumentSymbol[]>
        {
            return new Promise((resolve, reject) => {
                resolve([])
            })
        }
    }

    const providerSymbol = vscode.languages.registerDocumentSymbolProvider(
        sel,
        new NivaDocumentSymbolProvider(),
        { label: 'Niva' }
    )

    /** @implements {HoverProvider} */
    class NivaHoverProvider {
        /**
        * @param {vscode.TextDocument} document
        */
        provideHover(document, position, token) {
            const __range = document.getWordRangeAtPosition(position)
            const __word = document.getText(__range)

            return new Promise((resolve, reject) => {
                reject()
            })
        }
    }

    const providerHover = vscode.languages.registerHoverProvider(
        sel,
        new NivaHoverProvider()
    )

    context.subscriptions.push(
        provider2, // TODO rename
        provider1, // TODO rename
        providerHover,
        providerSymbol
    )
}
