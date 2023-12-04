"use strict"

// Used for TypeScript JSDoc @types
const vscode = require('vscode')
const {
    HoverProvider,
    Hover
} = require('vscode')

const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')

exports.activate = function (context) {
    const diagnostics = vscode.languages.createDiagnosticCollection('niva')
    context.subscriptions.push(diagnostics)

    console.log("[Niva-Lint] Initialized.")


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
        provider1, // TODO rename
        providerHover,
        providerSymbol
    )
}
