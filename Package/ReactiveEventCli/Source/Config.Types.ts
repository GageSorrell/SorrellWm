/**
 * @file      Config.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/**
 * The format of the JSON config file for using the CLI commands
 * offered by `reactive-event`.
 */
export type CliConfig =
    {
        /**
         * The path to the file containing the `declare module` block that augments
         * the `Registrar` type with your event declarations.  This path should be
         * included in your `tsconfig.json`.
         */
        AugmentationModulePath: string;

        /**
         * `reactive-event-cli` can create modules for you that export the reactive
         * IPC functions, scoped to your `PackageKey`.
         */
        IpcModulePath?:
        {
            /** The path of the module that calls `getReactiveIpcMain`, and exports its output. */
            Main?: string;

            /** The path of the module that calls `getReactiveIpcHooks`, and exports its output. */
            Renderer?: string;
        };

        /**
         * The unique identifier for your package.  This allows `reactive-event`
         * to be used by your package *and* any dependencies simultaneously.
         */
        PackageKey: string;

        /**
         * The path to the file that exports types scoped to your `PackageKey`.
         * Every type exported by `reactive-event/scoped` is imported here,
         * and a new type of the same name is defined, with your `PackageKey` filled in
         * for the `PackageKey` type parameter.  This path should be included in your
         * `tsconfig.json`.
         */
        ScopedModulePath: string;
    };

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
type CliConfigSchema =
    CliConfig &
    {
        "$schema": string;
    };
