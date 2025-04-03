/* File:      Start.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import * as FilteredLogStatements from "./FilteredLogStatements.json";
import { type ChildProcess, spawn } from "child_process";

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
            return "📦 " + Line.slice(4);
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

const Start = async (): Promise<void> =>
{
    try
    {
        const Child: ChildProcess = spawn(
            "npm",
            [ "run", "start-proper" ],
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

        Child.on("close", (Code: number | null) =>
        {
            process.stdout.write(`👋 Goodbye!  Exit code is ${ Code }.`);
        });
    }
    catch (Error: unknown)
    {
        process.stdout.write(JSON.stringify(Error));
    }
};

Start();
