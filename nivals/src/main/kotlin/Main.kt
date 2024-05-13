package org.example

import org.eclipse.lsp4j.*
import org.eclipse.lsp4j.jsonrpc.messages.Either
import org.eclipse.lsp4j.launch.LSPLauncher
import org.eclipse.lsp4j.services.*
import java.io.InputStream
import java.io.OutputStream
import java.util.concurrent.CompletableFuture
import java.util.concurrent.Future
import kotlin.system.exitProcess
//import java.net.Socket

const val stdInput = true

fun main() {
//    println("halloow from niva server")

    val start = { `in`: InputStream?, out: OutputStream? ->
        val server = ExampleServer()
//        val server = SimpleLanguageServer()
        val launcher = LSPLauncher.createServerLauncher(server, `in`, out)
        server.connectClient(launcher.remoteProxy)
        val startListening: Future<*> = launcher.startListening()
        startListening.get()
    }

//    val launcher = LSPLauncher.createServerLauncher(server, System.`in`, System.out)


//    server.connect(launcher.remoteProxy)
//    launcher.startListening()

    start(System.`in`, System.out)
}

class ExampleServer : LanguageServer, LanguageClientAware {
    private var errorCode: Int = 1
    private val textDocumentService = ExampleTextDocumentService()
    private val workspaceService = ExampleWorkspaceService()

    private var client: LanguageClient? = null

    fun connectClient(client: LanguageClient?) {
        this.client = client
    }

    // https://microsoft.github.io/language-server-protocol/specification#initialize
    override fun initialize(params: InitializeParams?): CompletableFuture<InitializeResult>? {
//        println("initialization")
        val capabilities = ServerCapabilities()

        capabilities.textDocumentSync = Either.forLeft(TextDocumentSyncKind.Full)
        capabilities.completionProvider = CompletionOptions()

        return CompletableFuture.completedFuture(InitializeResult(capabilities))
    }

    // https://microsoft.github.io/language-server-protocol/specification#shutdown
    override fun shutdown(): CompletableFuture<Any>? {
        errorCode = 0
        return null
    }

    // https://microsoft.github.io/language-server-protocol/specification#exit
    override fun exit() {
//        println("EEXXXXITING")
        exitProcess(errorCode)
    }

    override fun getTextDocumentService(): TextDocumentService? {
//        println("getTextDocumentService")

        return textDocumentService
    }

    override fun getWorkspaceService(): WorkspaceService? {
//        println("getWorkspaceService")

        return workspaceService
    }

    override fun connect(client: LanguageClient) {
//        println("getWorkspaceService")

        textDocumentService.client = client
    }
}

class ExampleTextDocumentService : TextDocumentService {
    var client: LanguageClient? = null

    override fun completion(position: CompletionParams?): CompletableFuture<Either<MutableList<CompletionItem>, CompletionList>> {
//        println("complition")

        val item1 = CompletionItem("Racket")
        item1.data = 1
        item1.detail = "Racket details"
        item1.documentation = Either.forLeft("Racket documentation")

        val item2 = CompletionItem("snippetExample")
        item2.data = 3
        item2.detail = "snippetExample details"
        item2.insertText = "snippetExample(){\n  print(\"hello lsp!\")\n}"

        return CompletableFuture.completedFuture(Either.forRight(CompletionList(listOf(item1, item2))))
    }

    override fun didOpen(params: DidOpenTextDocumentParams?) {
//        println("didOpen")
    }

    override fun didSave(params: DidSaveTextDocumentParams?) {
    }

    override fun didClose(params: DidCloseTextDocumentParams?) {
    }

    override fun didChange(params: DidChangeTextDocumentParams) {
        client?.let { warnAllCaps(it, params) }
    }
}

// https://code.visualstudio.com/api/language-extensions/language-server-extension-guide#adding-a-simple-validation
fun warnAllCaps(client: LanguageClient, params: DidChangeTextDocumentParams) {
    val pattern: Regex = """\b[A-Z]{2,}\b""".toRegex()

    val diagnostics = mutableListOf<Diagnostic>()

    for ((index, line) in params.contentChanges[0].text.lines().withIndex()) {
        for (match in pattern.findAll(line)) {
            val d = Diagnostic()
            d.severity = DiagnosticSeverity.Warning
            val start = Position(index, match.range.first)
            val end = Position(index, match.range.last + 1)
            d.range = Range(start, end)
            d.message = "${match.value} is all uppercase."
            d.source = "ex"
            diagnostics.add(d)
        }
    }

    client.publishDiagnostics(PublishDiagnosticsParams(params.textDocument.uri, diagnostics))
}

class ExampleWorkspaceService : WorkspaceService {
    override fun didChangeWatchedFiles(params: DidChangeWatchedFilesParams?) {
    }

    override fun didChangeConfiguration(params: DidChangeConfigurationParams?) {
    }
}
