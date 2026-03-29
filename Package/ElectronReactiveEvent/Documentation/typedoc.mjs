/* File:      typedoc.mjs
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

// @ts-check

/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/typedef */

/** @import { TypeDocOptions } from "typedoc" */

/** @type {TypeDocOptions} */
const Options =
    {
        disableSources: true,
        entryPoints: [
            "../Source/Internal/index.inner.ts",
            "../Source/Shared/index.inner.ts",
            "../Source/index.ts"
        ],
        indexFormat: "table",
        navigation: {
            includeGroups: true
        },
        out: "./reference",
        pageTitleTemplates:
        {
            member: (Arguments) =>
            {
                if (Arguments.kind === "Type Alias")
                {
                    const GenericIndex = Arguments.name.indexOf("\\<");
                    if (GenericIndex > 0)
                    {
                        const Name = Arguments.name.slice(0, GenericIndex);
                        return `Type: ${ Name }`;
                    }

                }

                return (
                    `${ Arguments.keyword ? `${ Arguments.keyword } ` : "" }` +
                    `${ Arguments.kind }: ${ Arguments.name }`
                );
            }
        },
        plugin: [
            "typedoc-plugin-markdown",
            "typedoc-vitepress-theme"
        ],
        readme: "none",
        requiredToBeDocumented: [
            "Namespace",
            "Enum",
            "EnumMember",
            "Variable",
            "Function",
            "Class",
            "Interface",
            "Property",
            "Method",
            "Accessor",
            "TypeAlias"
        ],
        treatValidationWarningsAsErrors: false,
        tsconfig: "../tsconfig.json",
        useCodeBlocks: true,
        validation: {
            notDocumented: true
        }
    // @TODO Enable this once you believe that all
    // documentation has been written.
    // "treatValidationWarningsAsErrors": true
    };

export default Options;
