/**
 * Extension operations for the SorrellWm code extension.
 *
 * @module @sorrell/sorrell-wm-code-extension/Extension
 *
 * @file      Extension.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    CancellationError,
    type CancellationToken,
    EndOfLine,
    type ExtensionContext,
    type FileCreateEvent,
    type FileStat,
    type FileSystemWatcher,
    FileType,
    LanguageModelTextPart,
    type LanguageModelTool,
    type LanguageModelToolInvocationOptions,
    type LanguageModelToolInvocationPrepareOptions,
    LanguageModelToolResult,
    type OutputChannel,
    Position,
    type PreparedToolInvocation,
    type QuickPickItem,
    Selection,
    type TextDocument,
    type TextDocumentChangeEvent,
    type TextDocumentWillSaveEvent,
    TextEdit,
    ThemeIcon,
    Uri,
    WorkspaceEdit,
    type WorkspaceFolder,
    commands,
    lm,
    window,
    workspace
} from "vscode";
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
    CreateReactComponentFiles,
    type ReactComponentFile,
    ValidateReactComponentName
} from "./ReactComponent.js";
import { isAbsolute, posix, relative, resolve } from "node:path";
import { IsGitIgnored } from "./Git.js";

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

/** A workspace directory presented by the component directory picker. */
interface DirectoryQuickPickItem extends QuickPickItem
{
    readonly DirectoryUri: Uri;
}

/** Input accepted by the React component language model tool. */
interface CreateReactComponentToolInput
{
    readonly componentName: string;
    readonly directoryPath: string;
}

const IgnoredDirectoryNames: ReadonlySet<string> = new Set([
    ".git",
    "node_modules"
]);
const PendingFiles: Map<string, Promise<void>> = new Map();
const ConfigurationSection: string = "sorrellWmCodeExtension";
const InsertHeaderOnAnyFileCreationSetting: string =
    "headers.insertOnAnyFileCreation";
const CreateReactComponentCommand: string =
    "sorrellWmCodeExtension.createReactComponent";
const CreateReactComponentToolName: string =
    "sorrellWm_createReactComponent";
let Output: OutputChannel | undefined;

/**
 * Language model tool that creates a React component directory.
 *
 * @category tools
 * @since 0.1.0
 */
const CreateReactComponentTool: LanguageModelTool<CreateReactComponentToolInput> = {
    invoke: async (
        Options: LanguageModelToolInvocationOptions<
            CreateReactComponentToolInput
        >,
        Token: CancellationToken
    ): Promise<LanguageModelToolResult> =>
    {
        if (Token.isCancellationRequested)
        {
            throw new CancellationError();
        }

        const ParentDirectory: Uri = await ResolveToolParentDirectory(
            Options.input.directoryPath
        );

        if (Token.isCancellationRequested)
        {
            throw new CancellationError();
        }

        const ComponentDirectory: Uri =
            await CreateReactComponentInDirectory(
                ParentDirectory,
                Options.input.componentName
            );
        const ResultMessage: string =
            `Created React component "${ Options.input.componentName }" at `
            + `"${ ComponentDirectory.fsPath }" with its six standard source files.`;

        Output?.appendLine(ResultMessage);

        return new LanguageModelToolResult([
            new LanguageModelTextPart(ResultMessage)
        ]);
    },
    prepareInvocation: (
        Options: LanguageModelToolInvocationPrepareOptions<
            CreateReactComponentToolInput
        >,
        _Token: CancellationToken
    ): PreparedToolInvocation =>
    {
        return {
            confirmationMessages: {
                message:
                    `Create "${ Options.input.componentName }" beneath `
                    + `"${ Options.input.directoryPath }"?  `
                    + "This operation creates a directory containing six source files.",
                title: "Create React Component"
            },
            invocationMessage:
                `Creating React component ${ Options.input.componentName }`
        };
    }
};

/**
 * Start watching the workspace for newly created TypeScript and C++ files, and
 * for the narrower editor-driven creation and empty-file-save events used
 * when header insertion is not unrestricted.
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
        commands.registerCommand(
            CreateReactComponentCommand,
            CreateReactComponent
        ),
        lm.registerTool(
            CreateReactComponentToolName,
            CreateReactComponentTool
        ),
        workspace.onDidChangeTextDocument(QueueJsDocExpansion),
        workspace.onDidCreateFiles(HandleWorkspaceFilesCreated),
        workspace.onWillSaveTextDocument(HandleTextDocumentWillSave),
        Watcher.onDidCreate(HandleWatcherFileCreated)
    );
}

/**
 * Determine whether a header should be inserted into every newly created
 * source file, regardless of how it was created.  When this setting is
 * disabled, headers are only inserted into files created through an editor
 * gesture such as the Explorer's "New File" command, or into files that are
 * empty or contain only whitespace when saved.
 *
 * @returns {boolean} Whether unrestricted, disk-wide header insertion is enabled.
 */
function ShouldInsertHeaderOnAnyFileCreation(): boolean
{
    return workspace
        .getConfiguration(ConfigurationSection)
        .get<boolean>(InsertHeaderOnAnyFileCreationSetting, true);
}

/**
 * Insert a header into a file the disk watcher observed being created, when
 * insertion is not restricted to editor-driven file creation.
 *
 * @param FileUri - The URI reported by the workspace file watcher.
 * @returns {void}
 */
function HandleWatcherFileCreated(FileUri: Uri): void
{
    if (ShouldInsertHeaderOnAnyFileCreation())
    {
        QueueHeaderInsertion(FileUri);
    }
}

/**
 * Insert headers into files created through an editor gesture, such as the
 * Explorer's "New File" command, drag-and-drop, or paste.  Runs only when
 * header insertion is restricted to editor-driven file creation, since the
 * disk watcher already covers this case otherwise.
 *
 * @param Event - The workspace file-creation event.
 * @returns {void}
 */
function HandleWorkspaceFilesCreated(Event: FileCreateEvent): void
{
    if (ShouldInsertHeaderOnAnyFileCreation())
    {
        return;
    }

    for (const FileUri of Event.files)
    {
        QueueHeaderInsertion(FileUri);
    }
}

/**
 * Insert a header into an empty or whitespace-only document as it is saved,
 * when header insertion is restricted to editor-driven file creation.
 *
 * @param Event - The text document about to be saved.
 * @returns {void}
 */
function HandleTextDocumentWillSave(Event: TextDocumentWillSaveEvent): void
{
    if (ShouldInsertHeaderOnAnyFileCreation())
    {
        return;
    }

    const Document: TextDocument = Event.document;

    if (
        !IsSupportedSourcePath(Document.uri.path)
        || Document.getText().trim().length > 0
    )
    {
        return;
    }

    Event.waitUntil(CreateEmptyDocumentHeaderEdits(Document));
}

/**
 * Build the pre-save edit that inserts a generated header into an empty or
 * whitespace-only document.
 *
 * @param Document - The document being saved.
 * @returns {Promise<ReadonlyArray<TextEdit>>} The edits to apply before the save completes.
 */
async function CreateEmptyDocumentHeaderEdits(
    Document: TextDocument
): Promise<ReadonlyArray<TextEdit>>
{
    const Folder: WorkspaceFolder | undefined =
        workspace.getWorkspaceFolder(Document.uri);

    if (Folder === undefined || await IsGitIgnored(Document.uri.fsPath))
    {
        return [];
    }

    const Package: PackageContext = await FindPackageContext(Document.uri, Folder);
    const ModuleName: string = DeriveModuleName(
        Document.uri.fsPath,
        Package.RootPath,
        Package.Name
    );
    const NewLine: string = Document.eol === EndOfLine.CRLF ? "\r\n" : "\n";
    const Header: string = CreateHeader(
        Document.uri.fsPath,
        ModuleName,
        new Date().getFullYear(),
        NewLine
    );

    Output?.appendLine(`Added a source header to ${Document.uri.fsPath}.`);

    return [
        TextEdit.insert(new Position(0, 0), `${Header}${NewLine}${NewLine}`)
    ];
}

/**
 * Prompt for and create a React component beneath the selected directory.
 *
 * @param Resource - The resource selected in the Explorer context menu.
 * @returns {Promise<void>} A promise that settles after creation is attempted.
 *
 * @category commands
 * @since 0.1.0
 */
const CreateReactComponent = async (Resource?: Uri): Promise<void> =>
{
    try
    {
        if (
            Resource === undefined
            && (workspace.workspaceFolders === undefined
                || workspace.workspaceFolders.length === 0)
        )
        {
            void window.showErrorMessage(
                "Open a workspace before creating a React component."
            );
            return;
        }

        const ParentDirectory: Uri | undefined =
            await ResolveComponentParentDirectory(Resource);

        if (ParentDirectory === undefined)
        {
            return;
        }

        const ComponentName: string | undefined = await window.showInputBox({
            ignoreFocusOut: true,
            placeHolder: "MyComponent",
            prompt: "Enter a PascalCase name for the React component.",
            title: "Create React Component",
            validateInput: ValidateReactComponentName
        });

        if (ComponentName === undefined)
        {
            return;
        }

        await CreateReactComponentInDirectory(
            ParentDirectory,
            ComponentName
        );

        Output?.appendLine(
            `Created React component ${ ComponentName } in ${ ParentDirectory.fsPath }.`
        );
    }
    catch (Error: unknown)
    {
        const Message: string =
            `Could not create the React component: ${ FormatError(Error) }`;

        Output?.appendLine(Message);
        void window.showErrorMessage(Message);
    }
};

/**
 * Create a React component directory and its six standard source files.
 *
 * @param ParentDirectory - The directory that will contain the component.
 * @param ComponentName - The PascalCase component name.
 * @returns {Promise<Uri>} The URI of the created component directory.
 * @throws {Error} When the name is invalid, the target exists, or creation fails.
 *
 * @category constructors
 * @since 0.1.0
 */
const CreateReactComponentInDirectory = async (
    ParentDirectory: Uri,
    ComponentName: string
): Promise<Uri> =>
{
    const ValidationMessage: string | undefined =
        ValidateReactComponentName(ComponentName);

    if (ValidationMessage !== undefined)
    {
        throw new Error(ValidationMessage);
    }

    const ComponentDirectory: Uri = Uri.joinPath(
        ParentDirectory,
        ComponentName
    );

    if (await ResourceExists(ComponentDirectory))
    {
        throw new Error(
            `A file or directory named "${ ComponentName }" already exists.`
        );
    }

    await workspace.fs.createDirectory(ComponentDirectory);

    const Edit = new WorkspaceEdit();
    const Files: ReadonlyArray<ReactComponentFile> =
        CreateReactComponentFiles(ComponentName);

    for (const File of Files)
    {
        Edit.createFile(
            Uri.joinPath(ComponentDirectory, File.Name),
            { contents: new TextEncoder().encode(File.Content) }
        );
    }

    const WasApplied: boolean = await workspace.applyEdit(Edit);

    if (!WasApplied)
    {
        throw new Error("VS Code rejected the component workspace edit.");
    }

    return ComponentDirectory;
};

/**
 * Resolve and validate the absolute workspace directory supplied to the tool.
 *
 * @param DirectoryPath - The absolute file-system path supplied by the model.
 * @returns {Promise<Uri>} The corresponding readable workspace directory URI.
 * @throws {Error} When the path is relative, outside the workspace, or not a directory.
 *
 * @category validation
 * @since 0.1.0
 */
const ResolveToolParentDirectory = async (
    DirectoryPath: string
): Promise<Uri> =>
{
    if (!isAbsolute(DirectoryPath))
    {
        throw new Error(
            `The directoryPath must be absolute, but received "${ DirectoryPath }".`
        );
    }

    const NormalizedPath: string = resolve(DirectoryPath);
    const Folders: ReadonlyArray<WorkspaceFolder> =
        workspace.workspaceFolders ?? [];

    for (const Folder of Folders)
    {
        const RelativePath: string = relative(
            Folder.uri.fsPath,
            NormalizedPath
        );
        const IsInsideFolder: boolean =
            RelativePath === ""
            || (
                RelativePath !== ".."
                && !RelativePath.startsWith("../")
                && !RelativePath.startsWith("..\\")
                && !isAbsolute(RelativePath)
            );

        if (!IsInsideFolder)
        {
            continue;
        }

        const DirectoryUri: Uri = RelativePath.length === 0
            ? Folder.uri
            : Uri.joinPath(
                Folder.uri,
                ...RelativePath.split(/[\\/]/u)
            );

        let Status: FileStat;

        try
        {
            Status = await workspace.fs.stat(DirectoryUri);
        }
        catch
        {
            throw new Error(
                "The directoryPath does not exist or cannot be read: "
                + `"${ NormalizedPath }".`
            );
        }

        if ((Status.type & FileType.Directory) === 0)
        {
            throw new Error(
                "The directoryPath does not identify a directory: "
                + `"${ NormalizedPath }".`
            );
        }

        return DirectoryUri;
    }

    throw new Error(
        "The directoryPath must be inside an open workspace folder: "
        + `"${ NormalizedPath }".`
    );
};

/**
 * Resolve the directory beneath which a component should be created.
 *
 * @param Resource - The Explorer resource supplied to the command.
 * @returns {Promise<Uri | undefined>} The selected or interactively chosen directory.
 *
 * @category commands
 * @since 0.1.0
 */
const ResolveComponentParentDirectory = async (
    Resource?: Uri
): Promise<Uri | undefined> =>
{
    if (Resource === undefined)
    {
        return PromptForComponentParentDirectory();
    }

    const Status = await workspace.fs.stat(Resource);

    return (Status.type & FileType.Directory) !== 0
        ? Resource
        : Uri.joinPath(Resource, "..");
};

/**
 * Prompt for a workspace directory with VS Code's fuzzy Quick Pick.
 *
 * @returns {Promise<Uri | undefined>} The chosen directory, or `undefined` when cancelled.
 *
 * @category commands
 * @since 0.1.0
 */
const PromptForComponentParentDirectory = async (): Promise<Uri | undefined> =>
{
    const SelectedDirectory: DirectoryQuickPickItem | undefined =
        await window.showQuickPick(
            CreateDirectoryQuickPickItems(),
            {
                ignoreFocusOut: true,
                matchOnDescription: true,
                matchOnDetail: true,
                placeHolder: "Type part of a workspace-relative or absolute path",
                prompt: "Choose the directory that will contain the component directory.",
                title: "Create React Component: Select Directory"
            }
        );

    return SelectedDirectory?.DirectoryUri;
};

/**
 * Create searchable Quick Pick items for every workspace directory.
 *
 * @returns {Promise<ReadonlyArray<DirectoryQuickPickItem>>} The searchable directory items.
 *
 * @category constructors
 * @since 0.1.0
 */
const CreateDirectoryQuickPickItems = async (): Promise<
    ReadonlyArray<DirectoryQuickPickItem>
> =>
{
    const Folders: ReadonlyArray<WorkspaceFolder> =
        workspace.workspaceFolders ?? [];
    const DirectoryGroups: ReadonlyArray<ReadonlyArray<Uri>> =
        await Promise.all(
            Folders.map(
                (Folder: WorkspaceFolder): Promise<ReadonlyArray<Uri>> =>
                    FindDescendantDirectories(Folder.uri)
            )
        );
    const Items: Array<DirectoryQuickPickItem> = [];

    for (let FolderIndex = 0; FolderIndex < Folders.length; FolderIndex += 1)
    {
        const Folder: WorkspaceFolder | undefined = Folders[FolderIndex];
        const Directories: ReadonlyArray<Uri> | undefined =
            DirectoryGroups[FolderIndex];

        if (Folder === undefined || Directories === undefined)
        {
            continue;
        }

        for (const Directory of Directories)
        {
            const RelativePath: string = posix.relative(
                Folder.uri.path,
                Directory.path
            );

            Items.push({
                DirectoryUri: Directory,
                description: Folder.name,
                detail: Directory.fsPath,
                iconPath: ThemeIcon.Folder,
                label: RelativePath.length === 0 ? Folder.name : RelativePath,
                resourceUri: Directory
            });
        }
    }

    return Items.sort(
        (
            Left: DirectoryQuickPickItem,
            Right: DirectoryQuickPickItem
        ): number =>
        {
            const LabelComparison: number =
                Left.label.localeCompare(Right.label);

            return LabelComparison !== 0
                ? LabelComparison
                : (Left.description ?? "").localeCompare(
                    Right.description ?? ""
                );
        }
    );
};

/**
 * Recursively find directories beneath one workspace resource.
 *
 * @param Directory - The directory whose descendants should be found.
 * @returns {Promise<ReadonlyArray<Uri>>} The directory and readable descendants.
 *
 * @category utilities
 * @since 0.1.0
 */
const FindDescendantDirectories = async (
    Directory: Uri
): Promise<ReadonlyArray<Uri>> =>
{
    let Entries: ReadonlyArray<[string, FileType]>;

    try
    {
        Entries = await workspace.fs.readDirectory(Directory);
    }
    catch (Error: unknown)
    {
        Output?.appendLine(
            `Could not inspect ${ Directory.fsPath }: ${ FormatError(Error) }`
        );
        return [ Directory ];
    }

    const ChildDirectories: Array<Uri> = Entries
        .filter(([ Name, Type ]: [string, FileType]): boolean =>
            !IgnoredDirectoryNames.has(Name)
            && (Type & FileType.Directory) !== 0
            && (Type & FileType.SymbolicLink) === 0)
        .map(([ Name ]: [string, FileType]): Uri =>
            Uri.joinPath(Directory, Name));
    const DescendantGroups: ReadonlyArray<ReadonlyArray<Uri>> =
        await Promise.all(
            ChildDirectories.map(
                (ChildDirectory: Uri): Promise<ReadonlyArray<Uri>> =>
                    FindDescendantDirectories(ChildDirectory)
            )
        );

    return [ Directory, ...DescendantGroups.flat() ];
};

/**
 * Determine whether a workspace resource already exists.
 *
 * @param Resource - The resource whose existence should be tested.
 * @returns {Promise<boolean>} Whether the resource exists.
 *
 * @category validation
 * @since 0.1.0
 */
const ResourceExists = async (Resource: Uri): Promise<boolean> =>
{
    try
    {
        await workspace.fs.stat(Resource);
        return true;
    }
    catch
    {
        return false;
    }
};

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
 * Serialize header insertion events for an individual file, whether it was
 * reported by the disk watcher or by an editor-driven file-creation event.
 *
 * @param FileUri - The created file's URI.
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

    if (await IsGitIgnored(FileUri.fsPath))
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
