/* File:      Schema.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 * Comment:   This module defines the `CliConfig` type, from which the JSON schema
 *            is created for the JSON file that may be provided to the
 *            `register` command.
 */

/* eslint-disable @typescript-eslint/naming-convention */

export type CliConfig =
    {
        "$schema": string;

        /** The `name` of the interface that holds your `main` event declarations. */
        main:
        {
            /** The name of the interface type. */
            name: string;

            /** The path of the module that contains the interface type. */
            path: string;
        };

        /** The `name` of the interface that holds your `renderer` event declarations. */
        renderer:
        {
            /** The name of the interface type. */
            name: string;

            /** The path of the module that contains the interface type. */
            path: string;
        };

        /** Where the module containing the `declare module` blocks will be written. */
        outPath: string;
    };
