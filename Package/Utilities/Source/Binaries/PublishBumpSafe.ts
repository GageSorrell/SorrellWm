/* File:      PublishBumpSafe.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable no-console */

import { type ChildProcess, spawn } from "child_process";
import { join } from "path";
import { readFile } from "fs/promises";

type FPackageJson =
    {
        name?: string;
        version?: string;
    };

type FRunCommandResult =
    {
        ExitCode: number;
        StandardOutput: string;
        StandardError: string;
    };

function GetNpmExecutableName(): string
{
    return process.platform === "win32" ? "npm.cmd" : "npm";
}

async function RunCommand(
    Command: string,
    Arguments: ReadonlyArray<string>,
    UseInheritedStandardIo: boolean
): Promise<FRunCommandResult>
{
    return await new Promise<FRunCommandResult>((
        Resolve: ((Value: PromiseLike<FRunCommandResult> | FRunCommandResult) => void),
        Reject: ((Reason: unknown) => void)
    ): void =>
    {
        const TheChildProcess: ChildProcess = spawn(
            Command,
            [ ...Arguments ],
            {
                cwd: process.cwd(),
                shell: true,
                stdio: UseInheritedStandardIo ? "inherit" : "pipe"
            }
        );

        let StandardOutput: string = "";
        let StandardError: string = "";

        if (!UseInheritedStandardIo)
        {
            TheChildProcess.stdout?.on("data", (Chunk: Buffer | string): void =>
            {
                StandardOutput += Chunk.toString();
            });

            TheChildProcess.stderr?.on("data", (Chunk: Buffer | string): void =>
            {
                StandardError += Chunk.toString();
            });
        }

        TheChildProcess.on("error", (Error: Error): void =>
        {
            Reject(Error);
        });

        TheChildProcess.on("close", (ExitCode: number | null): void =>
        {
            Resolve({
                ExitCode: ExitCode ?? 1,
                StandardError,
                StandardOutput
            });
        });
    });
}

async function ReadLocalPackageJson(): Promise<Required<FPackageJson>>
{
    const PackageJsonPath: string = join(process.cwd(), "package.json");
    const PackageJsonText: string = await readFile(PackageJsonPath, "utf8");
    const PackageJson: FPackageJson = JSON.parse(PackageJsonText) as FPackageJson;

    if (typeof PackageJson.name !== "string" || PackageJson.name.length === 0)
    {
        throw new Error("The local package.json does not contain a valid \"name\" field.");
    }

    if (typeof PackageJson.version !== "string" || PackageJson.version.length === 0)
    {
        throw new Error("The local package.json does not contain a valid \"version\" field.");
    }

    return {
        name: PackageJson.name,
        version: PackageJson.version
    };
}

async function DoesPublishedVersionExist(
    PackageName: string,
    PackageVersion: string
): Promise<boolean>
{
    const NpmExecutableName: string = GetNpmExecutableName();

    const Result: FRunCommandResult = await RunCommand(
        NpmExecutableName,
        [
            "view",
            `${PackageName}@${PackageVersion}`,
            "version",
            "--json"
        ],
        false
    );

    if (Result.ExitCode === 0)
    {
        return true;
    }

    const CombinedOutput: string = `${Result.StandardOutput}\n${Result.StandardError}`.toLowerCase();

    if (
        CombinedOutput.includes("e404")
        || CombinedOutput.includes("404")
        || CombinedOutput.includes("no match found")
    )
    {
        return false;
    }

    throw new Error(
        [
            `Failed while checking whether ${PackageName}@${PackageVersion} exists on the registry.`,
            Result.StandardError.trim() || Result.StandardOutput.trim()
        ]
            .filter((Line: string) => Line.length > 0)
            .join("\n")
    );
}

async function RunNpmVersionPatch(): Promise<void>
{
    const NpmExecutableName: string = GetNpmExecutableName();

    const Result: FRunCommandResult = await RunCommand(
        NpmExecutableName,
        [
            "version",
            "patch"
        ],
        true
    );

    if (Result.ExitCode !== 0)
    {
        throw new Error("`npm version patch` failed.");
    }
}

async function RunNpmPublishPublic(): Promise<void>
{
    const NpmExecutableName: string = GetNpmExecutableName();

    const Result: FRunCommandResult = await RunCommand(
        NpmExecutableName,
        [
            "publish",
            "--access",
            "public"
        ],
        true
    );

    if (Result.ExitCode !== 0)
    {
        throw new Error("`npm publish --access public` failed.");
    }
}

async function PublishWithPatchOnVersionConflict(): Promise<void>
{
    const LocalPackageJson: Required<FPackageJson> = await ReadLocalPackageJson();

    const PublishedVersionExists: boolean = await DoesPublishedVersionExist(
        LocalPackageJson.name,
        LocalPackageJson.version
    );

    if (PublishedVersionExists)
    {
        console.log(
            /* eslint-disable-next-line @stylistic/max-len */
            `Version conflict detected for ${LocalPackageJson.name}@${LocalPackageJson.version}. Bumping patch version before publishing.`
        );

        await RunNpmVersionPatch();
    }
    else
    {
        console.log(
            /* eslint-disable-next-line @stylistic/max-len */
            `No published conflict detected for ${LocalPackageJson.name}@${LocalPackageJson.version}. Publishing current version.`
        );
    }

    await RunNpmPublishPublic();
}

function Run(): void
{
    PublishWithPatchOnVersionConflict().catch((Error: unknown): void =>
    {
        console.error(Error);
        process.exitCode = 1;
    });
}

Run();
