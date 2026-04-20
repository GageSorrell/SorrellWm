/**
 * @file      GenerateScopedTypes.Command.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc, no-console */

import { GetConfigSafe, GetDefaultConfig, HasConfig } from "./Config";
import type { CliConfig } from "./Config.Types";
import { GenerateScopedTypesInner } from "./GenerateScopedTypes";
import { SetCommand } from "./Command";

export async function GenerateScopedTypesCommand(): Promise<void>
{
    SetCommand("generate-scoped-types");
    await GenerateScopedTypes();
}

export async function GenerateScopedTypes(): Promise<void>
{
    const Config: CliConfig = await GetConfigSafe();
    const DefaultConfig: CliConfig = await GetDefaultConfig();

    if (!(await HasConfig()))
    {
        /* eslint-disable-next-line @stylistic/max-len */
        console.log("\n💡 Tip: You can create a default config file by running\n\n    npm exec electron-reactive-event setup\n");
    }

    const DefaultLabelScopedModulePath: string =
        Config.ScopedModulePath === DefaultConfig.ScopedModulePath
            ? "default"
            : "";

    if (!(await HasConfig()))
    {
        /* eslint-disable-next-line @stylistic/max-len */
        console.log("\n💡 Tip: You can create a default config file by running\n\n    npm exec electron-reactive-event setup\n");
    }

    /* eslint-disable @stylistic/max-len */
    console.log(`Writing scoped types module at ${ DefaultLabelScopedModulePath } path ${ Config.ScopedModulePath }...`);

    try
    {
        await GenerateScopedTypesInner();
        console.log(`Successfully created scoped types for PackageKey ${ Config.PackageKey }!`);
        process.exit(0);
    }
    catch
    {
        console.error(Error, "\n\n🚨 The scoped types could not be written.  The error is printed above.");
        process.exit(1);
    }
}
