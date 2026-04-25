/**
 * @file      yarn.config.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import { type Yarn as YarnTypes, defineConfig } from "@yarnpkg/types";

type FWorkspace = YarnTypes.Constraints.Workspace;

const SorrellWmScope: string = "@sorrellwm/";

const DependencyTypes: ReadonlyArray<string> =
    [
        "dependencies",
        "devDependencies",
        "peerDependencies",
        "optionalDependencies"
    ] as const;

type FDependencyType = typeof DependencyTypes[number];

function GetDependencyRange(
    Workspace: FWorkspace,
    DependencyName: string,
    DependencyType: FDependencyType
): string | undefined
{
    const DependencyBlock: Record<typeof DependencyName, unknown> =
        Workspace.manifest[DependencyType];

    if (
        DependencyBlock === null ||
        typeof DependencyBlock !== "object" ||
        Array.isArray(DependencyBlock)
    )
    {
        return undefined;
    }

    const DependencyRange: unknown = DependencyBlock[DependencyName];

    if (typeof DependencyRange !== "string")
    {
        return undefined;
    }

    return DependencyRange;
}

function HasDependency(
    Workspace: FWorkspace,
    DependencyName: string
): boolean
{
    return DependencyTypes.some((DependencyType: string) =>
    {
        return GetDependencyRange(Workspace, DependencyName, DependencyType) !== undefined;
    });
}

function IsSorrellWmWorkspace(Workspace: FWorkspace): boolean
{
    return Workspace.ident?.startsWith(SorrellWmScope) === true;
}

function EnforceBaseManifestFields(Workspace: FWorkspace): void
{
    Workspace.set("private", true);
    Workspace.set("license", "MIT");
}

function EnforceTypeScriptDependency(Workspace: FWorkspace): void
{
    Workspace.set(
        [
            "dependencies",
            "typescript"
        ],
        "^6.0.3"
    );
}

function EnforceTsoverSetup(Workspace: FWorkspace): void
{
    Workspace.set(
        [
            "devDependencies",
            "tsover"
        ],
        "latest"
    );

    Workspace.unset([
        "dependencies",
        "tsover"
    ]);

    Workspace.unset([
        "peerDependencies",
        "tsover"
    ]);

    Workspace.unset([
        "optionalDependencies",
        "tsover"
    ]);

    Workspace.set(
        [
            "overrides",
            "typescript"
        ],
        "npm:tsover@latest"
    );

    Workspace.set(
        [
            "dependencies",
            "tsover-runtime"
        ],
        "latest"
    );

    Workspace.set(
        [
            "devDependencies",
            "esbuild"
        ],
        "^0.28.0"
    );
}

export async function constraints(
    { Yarn }: YarnTypes.Constraints.Context
): Promise<void>
{
    for (const Workspace of Yarn.workspaces())
    {
        if (!IsSorrellWmWorkspace(Workspace))
        {
            continue;
        }

        EnforceBaseManifestFields(Workspace);

        if (HasDependency(Workspace, "tsover"))
        {
            EnforceTsoverSetup(Workspace);
        }
        else
        {
            EnforceTypeScriptDependency(Workspace);
        }
    }
}

export default defineConfig({ constraints });
