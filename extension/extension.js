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
        providerHover,
    )
}
