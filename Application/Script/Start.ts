/* File:      Start.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import * as FilteredLogStatements from "./FilteredLogStatements.json";
import { type ChildProcess, spawn } from "child_process";
import Chalk from "chalk";

const ModifyOutput = (Output: string): string =>
{
    return Output.split("\n").map((Line: string): string =>
    {
        if (Line.startsWith("> "))
        {
            return "";
        }
        else if (Line.startsWith("<i> "))
        {
            return (
                Chalk.hex("#FFFFFF").bgHex("#AAAAAA")(" ⬢ ") +
                Chalk.hex("#FFFFFF").bgGray(" Normal ") +
                Line
                    .slice(4)
                    .replace("[webpack-dev-server]", Chalk.bgGreen(" Webpack "))
                    .replace("[webpack-dev-middleware]", Chalk.bgGreen(" Webpack "))
                    .replaceAll("wait", "Wait")
            );
        }
        else if (Line.startsWith("[electronmon]"))
        {
            if (Line.includes("renderer file change"))
            {
                let OutLine: string = Line
                    .replace("[electronmon]", Chalk.bgMagenta(" Electronmon "))
                    .replace("renderer file change: ", "Module modified: ./")
                    .replaceAll("\\", "/")
                    .replaceAll("wait", "Wait")
                    .replace("Source/", "");

                OutLine = OutLine.split(": ")[0] + ": " + Chalk.hex("#EB4657")(OutLine.split(": ")[1]);

                return (
                    Chalk.hex("#FFFFFF").bgHex("#AAAAAA")(" • ") +
                    Chalk.hex("#FFFFFF").bgGray(" Normal ") +
                    OutLine
                );
            }
            else
            {
                return (
                    Chalk.hex("#FFFFFF").bgHex("#AAAAAA")(" • ") +
                    Chalk.hex("#FFFFFF").bgGray(" Normal ") +
                    Line.replace("[electronmon]", Chalk.bgMagenta(" Electronmon "))
                );
            }
        }
        else if (Line.startsWith("[") && Line.includes(":CONSOLE:"))
        {
            const Level: string = Line.includes(":INFO:")
                ? "Normal"
                : Line.includes(":WARN")
                    ? "Warn"
                    : Line.includes(":ERROR:")
                        ? "Error"
                        : "Verbose";

            const Body: string = Line.slice(Line.indexOf("] ") + 2);

            return (
                Chalk.hex("#FFFFFF").bgHex("#AAAAAA")(" ƒ ") +
                Chalk.hex("#FFFFFF").bgGray(` ${ Level } `) +
                Chalk.bgWhite(" Chrome Console ") +
                " " +
                Body
            );
        }

        const HasExcludedStatement: boolean =
            FilteredLogStatements.Statements.some((ExcludedStatement: string): boolean =>
            {
                return Line.includes(ExcludedStatement);
            });

        if (HasExcludedStatement)
        {
            return "";
        }

        return Line;
    }).join("\n");
};

let Child: ChildProcess | null = null;
let IsShuttingDown: boolean = false;

const KillChildProcesses = async (): Promise<void> =>
{
    const ChildProcessIdentifier: number | undefined = Child?.pid;
    if (ChildProcessIdentifier === undefined)
    {
        return;
    }

    await new Promise<void>((Resolve: ((Value: void | PromiseLike<void>) => void)) =>
    {
        const TaskKill: ChildProcess = spawn(
            `taskkill /PID ${ String(ChildProcessIdentifier) } /T /F`,
            {
                shell: false,
                stdio: "ignore",
                windowsHide: true
            }
        );

        TaskKill.on("close", () => Resolve());
        TaskKill.on("error", () => Resolve());
    });
};

const Shutdown = async (_SignalName: string): Promise<void> =>
{
    if (IsShuttingDown)
    {
        // Second Ctrl+C: hard exit.
        process.exit(1);
        return;
    }

    IsShuttingDown = true;

    // try
    // {
    //     await DoCleanupWork(SignalName);
    // }
    // catch (Error: unknown)
    // {
    //     process.stderr.write(`Cleanup error: ${ String(Error) }\n`);
    // }

    if (Child !== null)
    {
        try
        {
            await KillChildProcesses();
        }
        catch (Error: unknown)
        {
            process.stderr.write(`Failed to stop child: ${ String(Error) }\n`);
        }
    }

    spawn(
        "npm run kill-electron",
        {
            shell: true,
            stdio: [ "ignore", "pipe", "pipe" ]
        }
    );

    process.exit(0);
};

const RegisterSignalHandlers = (): void =>
{
    process.once("SIGINT", (): Promise<void> => Shutdown("SIGINT"));
    process.once("SIGTERM", (): Promise<void> => Shutdown("SIGTERM"));
};

const Start = async (): Promise<void> =>
{
    try
    {
        RegisterSignalHandlers();

        Child = spawn(
            "npm run start-proper",
            {
                shell: true,
                stdio: [ "ignore", "pipe", "pipe" ]
            }
        );

        if (Child.stdout)
        {
            Child.stdout?.on("data", (Data: Buffer) =>
            {
                const Text: string = Data.toString("utf8");
                const ModifiedText: string = ModifyOutput(Text);
                if (ModifiedText.trim() !== "")
                {
                    process.stdout.write(ModifiedText);
                }
            });
        }
        else
        {
            process.stdout.write("stdout was UNDEFINED.");
        }

        if (Child.stderr)
        {
            Child.stderr?.on("data", (Data: Buffer) =>
            {
                const Text: string = Data.toString("utf8");
                const ModifiedText: string = ModifyOutput(Text);
                if (ModifiedText.trim() !== "")
                {
                    process.stderr.write(ModifiedText);
                }
            });
        }
        else
        {
            process.stdout.write("stderr was UNDEFINED.");
        }

        // Child.on("close", (Code: number | null) =>
        // {
        //     process.stdout.write(`👋 Goodbye!  Exit code is ${ Code }.`);
        // });
    }
    catch (Error: unknown)
    {
        process.stdout.write(JSON.stringify(Error));
    }
};

Start();
