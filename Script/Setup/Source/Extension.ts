/**
 *
 *
 * @module @sorrell/wm-monorepo-setup/Extension
 *
 * @file      Extension.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { CaptureOutput, ExecuteQuietly } from "./Process.js";
import { Console, Effect } from "effect";
import type { ChildProcessSpawner } from "effect/unstable/process";
import { WithProgress } from "./Progress.js";

/**
 * Paths needed to build and install the repository's VS Code extension.
 */
export interface IExtensionPaths
{
    readonly RepositoryRoot: string;
    readonly VisualStudioCodePackage: string;
}

const ExtensionIdentifier: string = "GageSorrell.sorrell-wm-code-extension";

/**
 * Enable or disable the local SorrellWm VS Code extension.
 *
 * @param IsEnabled - Whether the extension should be installed.
 * @param IsVerbose - Whether interactive progress should be displayed.
 * @param Paths - Repository and VSIX paths.
 * @returns {Effect.Effect<void>} An effect that completes after configuration.
 */
export function ConfigureExtension(
    IsEnabled: boolean,
    IsVerbose: boolean,
    Paths: IExtensionPaths
): Effect.Effect<void, Error, ChildProcessSpawner.ChildProcessSpawner>
{
    return Effect.gen(function*()
    {
        const VisualStudioCodeExecutable: string = process.platform === "win32"
            ? "code.cmd"
            : "code";
        const NpmExecutable: string = process.platform === "win32" ? "npm.cmd" : "npm";
        const InstalledExtensions: string = yield* CaptureOutput(
            VisualStudioCodeExecutable,
            [ "--list-extensions" ],
            Paths.RepositoryRoot
        );
        const IsInstalled: boolean = InstalledExtensions
            .split(/\r?\n/u)
            .some((Identifier: string): boolean =>
                Identifier.toLowerCase() === ExtensionIdentifier.toLowerCase()
            );

        if (!IsEnabled)
        {
            if (!IsInstalled)
            {
                if (IsVerbose)
                {
                    yield* Console.log("The SorrellWm VS Code extension is already disabled.");
                }

                return;
            }

            yield* WithProgress(
                IsVerbose,
                "Disabling the SorrellWm VS Code extension",
                "Disabled the SorrellWm VS Code extension",
                ExecuteQuietly(
                    VisualStudioCodeExecutable,
                    [ "--uninstall-extension", ExtensionIdentifier ],
                    Paths.RepositoryRoot
                )
            );

            return;
        }

        yield* WithProgress(
            IsVerbose,
            "Building the SorrellWm VS Code extension",
            "Built the SorrellWm VS Code extension",
            ExecuteQuietly(
                NpmExecutable,
                [ "run", "package:vsix", "--workspace", "sorrell-wm-code-extension" ],
                Paths.RepositoryRoot
            )
        );

        yield* WithProgress(
            IsVerbose,
            "Installing and enabling the SorrellWm VS Code extension",
            "Installed and enabled the SorrellWm VS Code extension",
            Effect.gen(function*()
            {
                if (IsInstalled)
                {
                    yield* ExecuteQuietly(
                        VisualStudioCodeExecutable,
                        [ "--uninstall-extension", ExtensionIdentifier ],
                        Paths.RepositoryRoot
                    );
                }

                yield* ExecuteQuietly(
                    VisualStudioCodeExecutable,
                    [ "--install-extension", Paths.VisualStudioCodePackage, "--force" ],
                    Paths.RepositoryRoot
                );
            })
        );
    });
}
