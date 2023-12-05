// PeyTy (c) 2023
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

// Node.js features
const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')

// Decoration styles
const decorationType = window.createTextEditorDecorationType({
    // textDecoration: 'underline',
    after: { contentText: ')', color: '#999999' },
    before: { contentText: '(', color: '#999999' },
})
const decorationTypeIf = window.createTextEditorDecorationType({
    before: { contentText: 'if ', color: '#999999' },
})
const decorationTypeCase = window.createTextEditorDecorationType({
    before: { contentText: 'case ', color: '#999999' },
})

// Draws something OVER the text, does NOT add diagnostics/editable text to the editor
const decorate = (document) => {
    // TODO probably line-by-line is faster, also better to update on edited line
    const text = document.getText()

    const decorationsArray = []
    const decorationsArrayCase = []
    const decorationsArrayIf = []
    const openEditor = window.visibleTextEditors.filter(
        editor => editor.document.uri === document.uri
    )[0]

    // Ignore non-Niva documents
    if (!document.uri.fsPath.endsWith('.niva')) return

    // "Parser"
    const re = /[a-z]+:\s([a-zA-Z]+\s[a-zA-Z]+(\s[a-zA-Z]+)*)(\s|$)/g
    const conditions = /\|\s(.*\s=>\s)/g
    const switches = /\|\s/g

    // TODO make not object
    const parsed = {
        line: -1, col: 0,
    }

    let match = null
    let cases = false
    for (const line of text.split('\n')) {
        // Proceed
        parsed.line++

        // Detect `demo: aaa bbb ccc` and decorate as `demo: (aaa bbb ccc)`
        while ((match = re.exec(line)) != null) {
            parsed.col = match.index + match[0].length - match[1].length - 1

            let wordLength = match[1].trim().length

            let range = new Range(
                parsed.line, parsed.col,
                parsed.line, parsed.col + wordLength
            )

            decorationsArray.push({
                range
            })
        }

        // Remove to enable `if` decorations when syntax is settled
        // TODO
        continue

        // TODO rename
        let conded = false
        while ((match = conditions.exec(line)) != null) {
            parsed.col = match.index
            conded = true

            let wordLength = 1

            let range = new Range(
                parsed.line, parsed.col,
                parsed.line, parsed.col + wordLength
            )

            {
                (cases ? decorationsArrayCase : decorationsArrayIf).push({
                    range
                })
            }
        }

        if (!conded) while ((match = switches.exec(line)) != null) {
            cases = true
        }
    }

    openEditor.setDecorations(decorationType, decorationsArray)
    openEditor.setDecorations(decorationTypeCase, decorationsArrayCase)
    openEditor.setDecorations(decorationTypeIf, decorationsArrayIf)
}

exports.activate = function (context) {
    const diagnostics = vscode.languages.createDiagnosticCollection('niva')
    context.subscriptions.push(diagnostics)

    console.log("[Niva-Lint] Initialized.")

    // Events
    workspace.onDidOpenTextDocument(document => decorate(document))
    workspace.onDidChangeTextDocument(documentChange => decorate(documentChange.document))
    window.onDidChangeActiveTextEditor(editor => decorate(editor.document))

    // Basically a pattern to distinguish Niva files
    const selector = { scheme: 'file', language: 'niva' }

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('vsniva.helloWorld', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World from Niva!')
    })
    // context.subscriptions.push(disposable);

    // Local vscode-powered completion
    const providerLocalCompletion = vscode.languages.registerCompletionItemProvider(
        selector,
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
        // TODO use Niva-style trigger
        '.' // triggered whenever a '.' is being typed
    )

    // Uses language server
    const providerRemoteCompletion = vscode.languages.registerCompletionItemProvider(
        selector,
        {
            provideCompletionItems(document, position, token, context) {
                return new Promise((resolve, reject) => {
                    // TODO
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
                // TODO
                resolve([])
            })
        }
    }

    const providerSymbol = vscode.languages.registerDocumentSymbolProvider(
        selector,
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
                // TODO
                reject()
            })
        }
    }

    const providerHover = vscode.languages.registerHoverProvider(
        selector,
        new NivaHoverProvider()
    )

    context.subscriptions.push(
        providerLocalCompletion,
        providerRemoteCompletion,
        providerHover,
        providerSymbol
    )
}
