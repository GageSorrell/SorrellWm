#!/usr/bin/env node

/**
 * @file      index.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

// @TODO Temporary.
/* eslint-disable jsdoc/require-jsdoc */

import { type ChildProcess, spawn } from "child_process";
import { Code, type Formatter, MakeFormatter } from "@sorrell/cli-utilities";
import { type DefaultRenderer, Listr, type ListrTaskWrapper } from "listr2";
import { promises as Fs } from "fs";
import { GetPackageRootDirectory } from "@sorrell/utilities";
import { resolve } from "path";

async function InstallReactiveEventCli(): Promise<boolean>
{
    return await new Promise<boolean>((Resolve: ((Value: boolean) => void)) =>
    {
        const Command: string = process.platform === "win32" ? "npm.cmd" : "npm";

        const ChildProcess: ChildProcess = spawn(
            Command,
            [
                "install",
                "--save-dev",
                "reactive-event-cli"
            ],
            {
                shell: false,
                stdio: "ignore"
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

async function RunSetupWizard(): Promise<void>
{
    return await new Promise<void>((Resolve: () => void): void =>
    {
        const Command: string = process.platform === "win32" ? "npm.cmd" : "npm";

        const ChildProcess: ChildProcess = spawn(
            Command,
            [
                "exec",
                "--package=reactive-event-cli",
                "--",
                "reactive-event-cli-setup"
            ],
            {
                shell: false,
                stdio: "inherit"
            }
        );

        ChildProcess.on("error", Resolve);
        ChildProcess.on("close", Resolve);
    });
}

/**
 * Installs the latest version of the `reactive-event-cli` package to the NodeJS
 * project of the current working directory, then runs the CLI's `setup` command.
 */
async function Main(): Promise<void>
{

    const InstalledSuccessfully: boolean = await InstallReactiveEventCli();

    if (!InstalledSuccessfully)
    {
        console.error(`Failed to install ${ Code("reactive-event-cli") }`);
        process.exit(1);
    }

    type TaskWrapper = ListrTaskWrapper<unknown, typeof DefaultRenderer, typeof DefaultRenderer>;

    type TaskContext =
        {
            RootDirectory: string;
        };

    const GetRootDirectory = async (Context: TaskContext, Task: TaskWrapper): Promise<void> =>
    {
        Context.RootDirectory = await GetPackageRootDirectory();
        const PackageJsonPath: string = resolve(Context.RootDirectory, "package.json");
        const PackageJsonContent: string =
            await Fs.readFile(PackageJsonPath, { encoding: "utf-8" });
        type PackageJson = { name: string; };
        const PackageName: string = (JSON.parse(PackageJsonContent) as PackageJson).name;
        Task.title = `Found root directory of ${PackageName}.`;
    };

    const InstallCli = async (): Promise<void> =>
    {
        const Success: boolean = await InstallReactiveEventCli();
        if (!Success)
        {
            throw new Error("Failed to install reactive-event-cli.  Exiting...");
        }
    };

    await new Listr([
        {
            task: GetRootDirectory,
            title: "Finding the NodeJS project in which this command was run."
        },
        {
            task: InstallCli,
            title: `Adding ${ Code("reactive-event-cli") } as a devDependency.`
        }
    ],
    {
        renderer: "default"
    }).run();

    const Format: Formatter = MakeFormatter({
        "reactive-event-cli": Code,
        setup: Code
    });

    console.log(Format("Running the setup wizard of reactive-event-cli..."));

    await RunSetupWizard();
}

Main();
