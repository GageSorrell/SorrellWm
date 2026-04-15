/* File:      index.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import { type CliConfig, DeclareEvents, GetConfig } from "electron-reactive-event-cli";
import {
    type Disposable,
    type ExtensionContext,
    type OutputChannel,
    type TextDocument,
    window,
    workspace } from "vscode";
import { Project, type SourceFile } from "ts-morph";
import type { ChildProcess } from "child_process";
import TsMorph from "ts-morph";
import { dirname } from "path";
import { spawn } from "child_process";

async function FileUsesEventDecl(Document: TextDocument): Promise<boolean>
{
    const ProjectInstance: Project = new Project(
        {
            compilerOptions:
            {
                allowJs: false
            },
            useInMemoryFileSystem: true
        }
    );

    const SourceFile: SourceFile = ProjectInstance.createSourceFile(
        "temp.ts",
        Document.getText()
    );

    const TypeReferences: Array<TsMorph.TypeReferenceNode> = SourceFile.getDescendantsOfKind(
        TsMorph.SyntaxKind.TypeReference
    );

    for (const TypeRef of TypeReferences)
    {
        const TypeName: unknown = TypeRef.getTypeName().getText();

        if (TypeName === "EventDecl")
        {
            return true;
        }
    }

    return false;
}

let OutputChannel: OutputChannel;

async function RunNpmCommand(
    Cwd: string,
    Command: `npm ${ string }`,
    IgnoreStdio: boolean = false
): Promise<boolean>
{
    return await new Promise<boolean>((Resolve: ((Value: boolean) => void)) =>
    {
        const Command: string = process.platform === "win32" ? "npm.cmd" : "npm";

        const ChildProcess: ChildProcess = spawn(
            Command,
            Command.split(" ").slice(1),
            {
                shell: false,
                stdio: IgnoreStdio ? "ignore" : "inherit"
            }
        );

        ChildProcess.on("error", (): void =>
        {
            Resolve(false);
        });

        ChildProcess.on("close", (ExitCode: number | null): void =>
        {
            Resolve(ExitCode === 0);
        });
    });
}

export function activate(Context: ExtensionContext): void
{
    OutputChannel = window.createOutputChannel(
        "Electron Reactive Event",
        { log: true }
    );

    const Disposable: Disposable = workspace.onDidSaveTextDocument(
        async (Document: TextDocument) =>
        {
            if (!IsTypeScriptFile(Document))
            {
                return;
            }

            const SourceText: string = Document.getText();

            if (!SourceText.includes("EventDecl"))
            {
                return;
            }

            const UsesEventDecl: boolean = await FileUsesEventDecl(Document);

            if (UsesEventDecl)
            {
                // window.showInformationMessage(`EventDecl detected in ${ Document.fileName }.`);

                /* eslint-disable-next-line @stylistic/max-len */
                OutputChannel.appendLine(`Module ${ Document.fileName } was saved, and defines a type with \`EventDecl\`.  Updating event declarations file...`);

                try
                {
                    const Config: CliConfig = await GetConfig(dirname(Document.fileName));
                    // @TODO Check that the directory of the `AugmentationModulePath` exists.
                    // await RunNpmCommand("npm exec electron-reactive-event-cli declare-events");
                    await DeclareEvents(dirname(Document.fileName));
                }
                catch
                {
                    /* eslint-disable-next-line @stylistic/max-len */
                    OutputChannel.appendLine(`Could not find an electron-reactive-event-cli config file corresponding to module ${ Document.fileName }.`);
                }
            }
        }
    );

    Context.subscriptions.push(Disposable);
}

function IsTypeScriptFile(Document: TextDocument): boolean
{
    const SupportedLanguages: ReadonlyArray<string> =
        [
            "typescript",
            "typescriptreact"
        ] as const;

    return SupportedLanguages.includes(Document.languageId);
}

export function deactivate(): void { }
