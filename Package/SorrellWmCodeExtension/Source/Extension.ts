/**
 *
 *
 * @module @sorrell/sorrell-wm-code-extension/Extension
 *
 * @file      Extension.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    CreateHeader,
    DeriveModuleName,
    HasGeneratedHeader,
    IsSupportedSourcePath
} from "./Header.js";
import {
    CreateJsDocExpansion,
    IsJsDocSourcePath,
    type JsDocExpansion
} from "./JsDoc.js";
import {
    EndOfLine,
    Position,
    Selection,
    WorkspaceEdit,
    window,
    workspace
} from "vscode";
import type {
    ExtensionContext,
    FileSystemWatcher,
    OutputChannel,
    TextDocument,
    TextDocumentChangeEvent,
    Uri,
    WorkspaceFolder
} from "vscode";
import { posix } from "node:path";

interface PackageContext
{
    readonly Name: string;
    readonly RootPath: string;
    readonly Version: string | undefined;
}

interface PackageManifest
{
    readonly name?: unknown;
    readonly version?: unknown;
}

interface PackageManifestMetadata
{
    readonly Name: string | undefined;
    readonly Version: string | undefined;
}

const PendingFiles: Map<string, Promise<void>> = new Map();
let Output: OutputChannel | undefined;

/**
 * Start watching the workspace for newly created TypeScript and C++ files.
 *
 * @param Context - The VS Code extension context.
 * @returns {void}
 */
export function activate(Context: ExtensionContext): void
{
    Output = window.createOutputChannel("SorrellWm Code Extension");

    const Watcher: FileSystemWatcher = workspace.createFileSystemWatcher(
        "**/*.{ts,tsx,cc,cpp,cxx,h,hh,hpp,hxx,ixx,cppm,inl,ipp,tpp}",
        false,
        true,
        true
    );

    Context.subscriptions.push(
        Output,
        Watcher,
        workspace.onDidChangeTextDocument(QueueJsDocExpansion),
        Watcher.onDidCreate(QueueHeaderInsertion)
    );
}

/**
 * Expand a newly auto-closed JSDoc block when its source file has an owning package.
 *
 * @param Event - The VS Code document change that may have created the block.
 * @returns {void}
 */
function QueueJsDocExpansion(Event: TextDocumentChangeEvent): void
{
    const Document: TextDocument = Event.document;
    const Change = Event.contentChanges.at(-1);

    if (
        Change === undefined
        || !IsJsDocSourcePath(Document.uri.path)
        || Change.range.start.line >= Document.lineCount
    )
    {
        return;
    }

    const Line: number = Change.range.start.line;
    const LineText: string = Document.lineAt(Line).text;

    if (CreateJsDocExpansion(LineText, "Pending") === undefined)
    {
        return;
    }

    const DocumentVersion: number = Document.version;

    void ExpandJsDocComment(Document, DocumentVersion, Line).catch((Error: unknown): void =>
    {
        Output?.appendLine(
            `Could not expand a JSDoc comment in ${Document.uri.fsPath}: ${FormatError(Error)}`
        );
    });
}

/**
 * Replace one auto-closed JSDoc line and position the caret for its description.
 *
 * @param Document - The document containing the candidate comment.
 * @param DocumentVersion - The version observed when the comment was created.
 * @param Line - The zero-based line containing the comment.
 * @returns {Promise<void>} A promise that settles after the edit is attempted.
 */
async function ExpandJsDocComment(
    Document: TextDocument,
    DocumentVersion: number,
    Line: number
): Promise<void>
{
    const Folder: WorkspaceFolder | undefined = workspace.getWorkspaceFolder(Document.uri);

    if (Folder === undefined)
    {
        return;
    }

    const Package: PackageContext = await FindPackageContext(Document.uri, Folder);

    if (
        Package.Version === undefined
        || Document.version !== DocumentVersion
        || Line >= Document.lineCount
    )
    {
        return;
    }

    const NewLine: string = Document.eol === EndOfLine.CRLF ? "\r\n" : "\n";
    const Expansion: JsDocExpansion | undefined = CreateJsDocExpansion(
        Document.lineAt(Line).text,
        Package.Version,
        NewLine
    );

    if (Expansion === undefined)
    {
        return;
    }

    const Edit = new WorkspaceEdit();

    Edit.replace(Document.uri, Document.lineAt(Line).range, Expansion.Text);

    const WasApplied: boolean = await workspace.applyEdit(Edit);

    if (!WasApplied)
    {
        throw new Error("VS Code rejected the JSDoc workspace edit.");
    }

    const Editor = window.activeTextEditor;

    if (Editor?.document === Document)
    {
        const Cursor = new Position(
            Line + Expansion.CursorLineOffset,
            Expansion.CursorCharacter
        );

        Editor.selection = new Selection(Cursor, Cursor);
    }
}

/**
 * Release module-level state when the extension is deactivated.
 *
 * @returns {void}
 */
export function deactivate(): void
{
    PendingFiles.clear();
    Output = undefined;
}

/**
 * Serialize header insertion events for an individual file.
 *
 * @param FileUri - The URI reported by the workspace file watcher.
 * @returns {void}
 */
function QueueHeaderInsertion(FileUri: Uri): void
{
    const FileKey: string = FileUri.toString();

    if (PendingFiles.has(FileKey))
    {
        return;
    }

    const PendingInsertion: Promise<void> = AddHeader(FileUri)
        .catch((Error: unknown): void =>
        {
            Output?.appendLine(
                `Could not add a header to ${FileUri.fsPath}: ${FormatError(Error)}`
            );
        })
        .finally((): void =>
        {
            PendingFiles.delete(FileKey);
        });

    PendingFiles.set(FileKey, PendingInsertion);
}

/**
 * Insert and save a generated header unless the file already has one.
 *
 * @param FileUri - The new source file's URI.
 * @returns {Promise<void>} A promise that settles after the file is saved.
 */
async function AddHeader(FileUri: Uri): Promise<void>
{
    if (!IsSupportedSourcePath(FileUri.path))
    {
        return;
    }

    const Folder: WorkspaceFolder | undefined = workspace.getWorkspaceFolder(FileUri);

    if (Folder === undefined)
    {
        return;
    }

    const Document: TextDocument = await workspace.openTextDocument(FileUri);
    const ExistingContent: string = Document.getText();

    if (HasGeneratedHeader(ExistingContent))
    {
        return;
    }

    const Package: PackageContext = await FindPackageContext(FileUri, Folder);
    const ModuleName: string = DeriveModuleName(
        FileUri.fsPath,
        Package.RootPath,
        Package.Name
    );
    const NewLine: string = Document.eol === EndOfLine.CRLF ? "\r\n" : "\n";
    const Header: string = CreateHeader(
        FileUri.fsPath,
        ModuleName,
        new Date().getFullYear(),
        NewLine
    );
    const Edit: WorkspaceEdit = new WorkspaceEdit();

    Edit.insert(FileUri, new Position(0, 0), `${Header}${NewLine}${NewLine}`);

    const WasApplied: boolean = await workspace.applyEdit(Edit);

    if (!WasApplied)
    {
        throw new Error("VS Code rejected the workspace edit.");
    }

    const WasSaved: boolean = await Document.save();

    if (!WasSaved)
    {
        throw new Error("VS Code could not save the generated header.");
    }

    Output?.appendLine(`Added a source header to ${FileUri.fsPath}.`);
}

/**
 * Find the nearest package.json between a file and its workspace root.
 *
 * @param FileUri - The source file whose owning package is required.
 * @param Folder - The VS Code workspace folder containing the file.
 * @returns {Promise<PackageContext>} The package name, version, and file-system root.
 */
async function FindPackageContext(
    FileUri: Uri,
    Folder: WorkspaceFolder
): Promise<PackageContext>
{
    const WorkspaceRootPath: string = Folder.uri.path;
    let CurrentPath: string = posix.dirname(FileUri.path);

    while (IsInsideUriPath(CurrentPath, WorkspaceRootPath))
    {
        const ManifestUri: Uri = FileUri.with({
            path: posix.join(CurrentPath, "package.json")
        });
        const Manifest: PackageManifestMetadata | undefined =
            await ReadPackageManifest(ManifestUri);

        if (Manifest?.Name !== undefined)
        {
            return {
                Name: Manifest.Name,
                RootPath: FileUri.with({ path: CurrentPath }).fsPath,
                Version: Manifest.Version
            };
        }

        if (CurrentPath === WorkspaceRootPath)
        {
            break;
        }

        const ParentPath: string = posix.dirname(CurrentPath);

        if (ParentPath === CurrentPath)
        {
            break;
        }

        CurrentPath = ParentPath;
    }

    return {
        Name: Folder.name,
        RootPath: Folder.uri.fsPath,
        Version: undefined
    };
}

/**
 * Read package metadata without failing when a candidate manifest is absent.
 *
 * @param ManifestUri - The package.json URI to read.
 * @returns {Promise<PackageManifestMetadata | undefined>} The parsed package metadata.
 */
async function ReadPackageManifest(
    ManifestUri: Uri
): Promise<PackageManifestMetadata | undefined>
{
    try
    {
        const ManifestBytes: Uint8Array = await workspace.fs.readFile(ManifestUri);
        const ParsedManifest: unknown = JSON.parse(
            new TextDecoder().decode(ManifestBytes)
        );

        if (!IsPackageManifest(ParsedManifest))
        {
            return undefined;
        }

        return {
            Name: typeof ParsedManifest.name === "string"
                && ParsedManifest.name.length > 0
                ? ParsedManifest.name
                : undefined,
            Version: typeof ParsedManifest.version === "string"
                && ParsedManifest.version.length > 0
                ? ParsedManifest.version
                : undefined
        };
    }
    catch
    {
        return undefined;
    }
}

/**
 * Narrow parsed JSON to the portion of a package manifest that is needed.
 *
 * @param Value - The parsed JSON value.
 * @returns {boolean} Whether the value can contain a package name.
 */
function IsPackageManifest(Value: unknown): Value is PackageManifest
{
    return typeof Value === "object" && Value !== null;
}

/**
 * Determine whether a URI path is the root or one of its descendants.
 *
 * @param Path - The candidate URI path.
 * @param RootPath - The workspace root URI path.
 * @returns {boolean} Whether the candidate remains inside the root.
 */
function IsInsideUriPath(Path: string, RootPath: string): boolean
{
    const RelativePath: string = posix.relative(RootPath, Path);

    return RelativePath === ""
        || (!RelativePath.startsWith("../") && !posix.isAbsolute(RelativePath));
}

/**
 * Convert an unknown caught value into an output-channel message.
 *
 * @param ErrorValue - The value caught from a failed insertion.
 * @returns {string} A human-readable error message.
 */
function FormatError(ErrorValue: unknown): string
{
    return ErrorValue instanceof Error ? ErrorValue.message : String(ErrorValue);
}
