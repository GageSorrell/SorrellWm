/* File:      Schema.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 * Comment:   This module defines the `Schema` type, from which the JSON schema
 *            is created for the JSON file that may be provided to the
 *            `register` command.
 */

type Schema =
{
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

    /**
     * The glob(s) of path(s) to modules containing your event declarations.
     * If this property is not specified, then every `.ts` file in the project
     * (outside of `node_modules`) will be read by the CLI.
     */
    files?: Array<string>;

    /**
     * How the CLI will determine the ownership of each event declaration.
     */
    ownership:
        | {
            /**
             * The presence of a JSDoc comment containing `@MainEventDecl`
             * or `@RendererEventDecl` will be used to determine ownership
             * as `main` or the `renderer` respectively.
             *
             * You may specify custom comment tags by adding `mainTag` and
             * `rendererTag` properties in the `ownership` object.
             */
            strategy: "jsdoc";
        }
        | {
            /**
             * The presence of a JSDoc comment containing `mainTag`/`rendererTag`
             * will be used to determine ownership.
             */
            strategy: "jsdoc";

            /**
             * The `@`-prefixed tag that identifies event declarations as being
             * owned by `main`.
             */
            mainTag: `@${ string }`;

            /**
             * The `@`-prefixed tag that identifies event declarations as being
             * owned by the `renderer`.
             */
            rendererTag: `@${ string }`;
        }
        | {
            /**
             * The event declarations found in modules found in the `mainGlob` will
             * be identified as being owned my `main`, and likewise owned by the
             * `renderer` if found in the `rendererGlob`.
             *
             * If any module containing an event declaration is found under *both*
             * globs, then the CLI will fail and exit with an error message.
             *
             * Note that any module matching one of the globs must also match the
             * `files` glob(s).
             */
            strategy: "globs";

            /** The glob(s) specifying where modules containing `main` events reside. */
            mainGlob: Array<string>;

            /** The glob(s) specifying where modules containing `renderer` events reside. */
            rendererGlob: Array<string>;
        };
};
