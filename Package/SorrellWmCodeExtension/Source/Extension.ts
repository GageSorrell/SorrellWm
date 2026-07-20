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
    EndOfLine,
    Position,
    WorkspaceEdit,
    window,
    workspace
} from "vscode";
import type {
    ExtensionContext,
    FileSystemWatcher,
    OutputChannel,
    TextDocument,
    Uri,
    WorkspaceFolder
} from "vscode";
import { posix } from "node:path";

interface IPackageContext
{
    readonly Name: string;
    readonly RootPath: string;
}

interface IPackageManifest
{
    readonly name?: unknown;
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
        Watcher.onDidCreate(QueueHeaderInsertion)
    );
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

    const Package: IPackageContext = await FindPackageContext(FileUri, Folder);
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
 * @returns {Promise<IPackageContext>} The package name and file-system root.
 */
async function FindPackageContext(
    FileUri: Uri,
    Folder: WorkspaceFolder
): Promise<IPackageContext>
{
    const WorkspaceRootPath: string = Folder.uri.path;
    let CurrentPath: string = posix.dirname(FileUri.path);

    while (IsInsideUriPath(CurrentPath, WorkspaceRootPath))
    {
        const ManifestUri: Uri = FileUri.with({
            path: posix.join(CurrentPath, "package.json")
        });
        const PackageName: string | undefined = await ReadPackageName(ManifestUri);

        if (PackageName !== undefined)
        {
            return {
                Name: PackageName,
                RootPath: FileUri.with({ path: CurrentPath }).fsPath
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
        RootPath: Folder.uri.fsPath
    };
}

/**
 * Read a package name without failing when a candidate manifest is absent.
 *
 * @param ManifestUri - The package.json URI to read.
 * @returns {Promise<string | undefined>} The package name when one is present.
 */
async function ReadPackageName(ManifestUri: Uri): Promise<string | undefined>
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

        return typeof ParsedManifest.name === "string"
            && ParsedManifest.name.length > 0
            ? ParsedManifest.name
            : undefined;
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
function IsPackageManifest(Value: unknown): Value is IPackageManifest
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
