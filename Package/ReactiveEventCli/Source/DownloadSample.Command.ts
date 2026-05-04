/**
 * @file      DownloadSample.Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Code, Path } from "@sorrell/cli-utilities";
import { DefaultRenderer, Listr, type ListrDefaultRenderer, type ListrTaskWrapper } from "listr2";
import { type SimpleGit, simpleGit } from "simple-git";
import Chalk from "chalk";
import { promises as Fs } from "fs";
import { SimpleError } from "./Shared";
import { mkdir } from "fs/promises";
import { resolve } from "path";
import { tmpdir } from "os";

/** Downloads the sample project for this package. */
export async function DownloadSampleCommand(): Promise<void>
{
    type Context =
        {
            DownloadPath: string;
            Git: SimpleGit | undefined;
            TempPath: string;
        };

    type Wrapper = ListrTaskWrapper<unknown, ListrDefaultRenderer, ListrDefaultRenderer>;

    const Context: Context =
        {
            DownloadPath: "",
            Git: undefined,
            TempPath: ""
        };

    let DownloadPath: string = "";

    try
    {
        await new Listr<Context, ListrDefaultRenderer, ListrDefaultRenderer>([
            {
                task: async (Context: Context, Task: Wrapper): Promise<void> =>
                {
                    const SampleDirectoryName: string = "reactive-event-sample";
                    Context.DownloadPath = "./" + SampleDirectoryName;

                    DownloadPath = Context.DownloadPath;

                    Task.title = `Creating directory ${ Path(Context.DownloadPath) }.`;

                    await Fs.mkdir(Context.DownloadPath);

                    Task.title = `Created directory ${ Path(Context.DownloadPath) }.`;
                },
                title: "Creating directory "
            },
            {
                task: async (Context: Context, Task: Wrapper): Promise<void> =>
                {
                    Context.TempPath = resolve(tmpdir(), "reactive-event-cli");
                    await mkdir(Context.TempPath);
                    Task.title = "Created temp directory to download and process the sample project.";
                },
                title: "Creating temp directory to download and process the sample project."
            },
            {
                task: async (Context: Context, Task: Wrapper): Promise<void> =>
                {
                    Context.Git = simpleGit();
                    Task.title = `Initialized ${ Code("git") } client.`;
                },
                title: `Initializing ${ Code("git") } client.`
            },
            {
                task: async (Context: Context, Task: Wrapper): Promise<void> =>
                {
                    if (Context.Git === undefined)
                    {
                        throw new SimpleError("Git client was not initialized.");
                    }

                    await Context.Git.raw(
                        "clone",
                        "--filter=blob:none",
                        "--sparse",
                        "https://github.com/GageSorrell/SorrellWm.git",
                        Context.TempPath
                    );

                    /* eslint-disable-next-line @stylistic/max-len */
                    Task.title = `Performed sparse ${ Code("clone") } of the monorepo containing the sample project.`;
                },
                title: `Performing sparse ${ Code("clone") } of the monorepo containing the sample project.`
            },
            {
                task: async (Context: Context, Task: Wrapper): Promise<void> =>
                {
                    if (Context.Git === undefined)
                    {
                        throw new SimpleError("Git client was not initialized.");
                    }

                    await Context.Git.cwd(
                        {
                            path: resolve(Context.TempPath),
                            root: true
                        }
                    );

                    await Context.Git.raw(
                        "sparse-checkout",
                        "set",
                        resolve(Context.DownloadPath)
                    );

                    Task.title = `Performed ${ Code("sparse checkout") } of the sample project.`;
                },
                title: `Performing ${ Code("sparse checkout") } of the sample project.`
            },
            {
                task: async (Context: Context, Task: Wrapper): Promise<void> =>
                {
                    await Fs.rm(Context.TempPath, { force: true, recursive: true });

                    Task.title = "Deleted temp directory.";
                },
                title: "Deleting temp directory."
            }
        ],
        {
            renderer: DefaultRenderer
        }).run();
    }
    catch (ListrError: unknown)
    {
        if (ListrError instanceof SimpleError)
        {
            console.error(`🚨 ${ ListrError.TheMessage }`);
            process.exit(1);
        }
        else
        {
            console.dir(ListrError);
            console.error("\n🚨 Failed to download the sample project.  The error is printed above.");
            process.exit(1);
        }
    }

    console.log(`${ Chalk.green("✓") } Downloaded sample project to ${ Path(DownloadPath) }.`);
    process.exit(0);
}
