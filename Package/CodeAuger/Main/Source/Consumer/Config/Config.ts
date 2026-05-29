/**
 * @file      Config.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Path from "path";
import { IsValidTypeName } from "@sorrell/utilities/type";
import type { CodeFormatter, Config, Provider } from "./Config.Types.js";
import { IsValidFileSubpath } from "@sorrell/utilities/fs";
import { IsConfigValid, IsProvider } from "./Config.Internal.js";

/**
 * Determine whether a given consumer {@link Config} is valid.  This performs checks on
 * the current filesystem, to check that provider dependencies are valid, *etc*.
 *
 * @param Argument - The `"code-auger"` property of a provider's `package.json`.
 *
 * @returns {In is ExportedType} Whether the given {@link Argument} of a provider is valid.
 */
export function IsValid(Argument: unknown): boolean
{
    if (!IsConfigValid(Argument))
    {
        return false;
    }

    // @TODO
    return true;
}

export const CodeFormatters: ReadonlyArray<CodeFormatter> =
    [
        "eslint",
        "ox",
        "prettier"
    ] as const;

/**
 * Check whether a given {@link Provider} defined in a consumer's {@link Config} is valid.
 * This performs file/directory checks, rather than just checking types.
 * 
 * @param ConsumerRootPath - The root directory path of the consumer package.
 * @param BasePath - The {@link Config!BasePath | base path} of the consumer's {@link Config}. 
 * @param Argument - The value that is checked for being a *valid* {@link Provider | provider config}
 * for the consumer.
 * 
 * @returns {boolean} Whether the given {@link Argument} is a *valid* {@link Provider | provider config}
 * for the consumer.
 */
export function IsProviderValid(
    ConsumerRootPath: string,
    BasePath: string,
    Argument: unknown
): boolean
{
    if (!IsProvider(Argument))
    {
        return false;
    }

    if (Argument.Disabled || !("Path" in Argument) || Argument.Path === undefined)
    {
        return true;
    }
    else
    {
        return IsValidFileSubpath(Path.join(ConsumerRootPath, BasePath), Argument.Path);
    }
}