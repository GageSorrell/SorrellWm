/* File:      HandleVersioning.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

/* eslint-disable @typescript-eslint/naming-convention, no-console */

import { Code, Format } from "@sorrell/cli-utilities";
import { type Dirent, promises as Fs } from "fs";
import type { Redirect, VercelConfig } from "@vercel/config/v1";
import { resolve } from "path";

async function GetVercelConfig(): Promise<VercelConfig | undefined>
{
    const ConfigPath: string = resolve("vercel.json");
    try
    {
        const ConfigContents: string = await Fs.readFile(ConfigPath, { encoding: "utf-8" });

        return JSON.parse(ConfigContents) as VercelConfig;
    }
    catch
    {
        return undefined;
    }
}

type VersionString = `${ string }.${ string }.${ string }`;
type VersionSegments = [ string, string, string ];
type Version = [ number, number, number ];

function TryGetVersionStringDotIndices(In: unknown): [ number, number ] | undefined
{
    if (typeof In !== "string")
    {
        return undefined;
    }

    const DotIndices: [ number, number ] = [ -1, -1 ];

    DotIndices[0] = In.indexOf(".");
    DotIndices[1] = In.length > DotIndices[0] + 1
        ? In.indexOf(".", DotIndices[0] + 1)
        : -1;

    const AreIndicesValid: boolean = DotIndices.every((Index: number) => Index !== -1);

    return AreIndicesValid
        ? DotIndices
        : undefined;
}

function TryToVersionSegments(In: VersionString): VersionSegments;
function TryToVersionSegments(In: unknown): VersionSegments | undefined;
function TryToVersionSegments(In: unknown): VersionSegments | undefined
{
    if (typeof In !== "string")
    {
        return undefined;
    }

    const DotIndices: [ number, number ] | undefined = TryGetVersionStringDotIndices(In);

    if (DotIndices === undefined)
    {
        return undefined;
    }

    const Segments: [ string, string, string ] =
        [
            In.slice(0, DotIndices[0]),
            In.slice(DotIndices[0] + 1, DotIndices[1]),
            In.slice(DotIndices[1] + 1)
        ];

    const IsDigitsOnly = (InString: string): boolean => /^\d+$/.test(InString);
    const AreSegmentsDigitsOnly: boolean = Segments.every(IsDigitsOnly);

    return AreSegmentsDigitsOnly
        ? Segments
        : undefined;
}

function IsVersionString(In: unknown): In is VersionString
{
    if (typeof In !== "string")
    {
        return false;
    }

    const DotIndices: [ number, number ] | undefined = TryGetVersionStringDotIndices(In);

    if (DotIndices === undefined)
    {
        return false;
    }

    const Segments: VersionSegments | undefined = TryToVersionSegments(In);

    return Segments !== undefined;
}

function ToVersion(VersionString: VersionString): Version;
function ToVersion(VersionString: unknown): Version | undefined;
function ToVersion(VersionString: unknown): Version | undefined
{
    const Segments: VersionSegments | undefined = TryToVersionSegments(VersionString);

    if (Segments === undefined)
    {
        return undefined;
    }

    return Segments.map(parseInt) as Version;
}

async function GetVersions(): Promise<Array<Version>>
{
    const RootEntries: Array<Dirent> =
        await Fs.readdir(resolve("."), { recursive: false, withFileTypes: true });

    const IsVersionDirectory = (Entry: Dirent): boolean =>
    {
        return Entry.isDirectory() && IsVersionString(Entry.name);
    };

    const DirentToVersion = (Entry: Dirent): Version =>
    {
        if (IsVersionString(Entry.name))
        {
            return ToVersion(Entry.name);
        }
        else
        {
            console.error(
                /* eslint-disable-next-line @stylistic/max-len */
                `🚨 Directory ${ Entry.name } should have been a version string type, but it was not.  Exiting...`
            );
            process.exit(1);
        }
    };

    return RootEntries.filter(IsVersionDirectory).map(DirentToVersion);
}

function ToVersionString(Version: Version): VersionString
{
    return `${ Version[0] }.${ Version[1] }.${ Version[2] }`;
}

function GetLatestVersion(Versions: Array<Version>): Version
{
    const Sorted: Array<Version> = [ ...Versions ];
    Sorted.sort((A: Version, B: Version): number =>
    {
        type Sorting = [ boolean, boolean, boolean ];
        const Sorting: Sorting =
            [
                A[0] < B[0],
                A[1] < B[1],
                A[2] < B[2]
            ];

        const IsALessThanB: boolean = (
            Sorting[0] ||
            (!Sorting[0] && Sorting[1]) ||
            (!Sorting[0] && !Sorting[1] && Sorting[2])
        );

        return IsALessThanB
            ? -1
            : 1;
    });

    return Sorted[Sorted.length - 1] as Version;
}

async function Main(): Promise<void>
{
    const VercelConfig: VercelConfig | undefined = await GetVercelConfig();
    if (VercelConfig === undefined)
    {
        console.error(Format("🚨 Could not get vercel.json.  Exiting...", { "vercel.json": Code }));
        process.exit(1);
    }

    VercelConfig.redirects = VercelConfig?.redirects || [ ];

    const LatestVersionString: VersionString =
        ToVersionString(
            GetLatestVersion(
                await GetVersions()
            )
        );

    const PreviousVersionRedirectIndex: number =
        VercelConfig.redirects.findIndex((Redirect: Redirect): boolean =>
        {
            return Redirect.source === "/:prefix/latest/:path*";
        });

    if (PreviousVersionRedirectIndex !== -1)
    {
        VercelConfig.redirects.splice(PreviousVersionRedirectIndex, 1);
    }

    const NewVersionRedirect: Redirect =
        {
            destination: `/:prefix/${ LatestVersionString }/:path*`,
            source: "/:prefix/latest/:path*",

            permanent: false
        };

    VercelConfig.redirects.push(NewVersionRedirect);
}

Main();
