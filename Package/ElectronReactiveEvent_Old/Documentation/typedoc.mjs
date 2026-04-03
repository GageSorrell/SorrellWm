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
        favicon: "./public/logo.png",
        formatWithPrettier: true,
        indexFormat: "table",
        navigation:
        {
            includeGroups: true
        },
        // @note Upon each release, this must be manually updated to the latest version.
        out: "./1.0.0/reference",
        pageTitleTemplates:
        {
            member: (Arguments) =>
            {
                const Type = Arguments.kind === "Type Alias"
                    ? "Type"
                    : Arguments.kind;

                const Keyword = Arguments.keyword
                    ? ` (${ Arguments.keyword })`
                    : "";

                const GetNameWithoutTypeParameters = () =>
                {
                    const GenericIndex = Arguments.name.indexOf("\\<");
                    return (GenericIndex > 0)
                        ? Arguments.name.slice(0, GenericIndex)
                        : Arguments.name;
                };

                const Name = GetNameWithoutTypeParameters();

                return `${ Name } ${ Type }${ Keyword }`;
            }
        },
        plugin: [
            "typedoc-plugin-markdown",
            "typedoc-vitepress-theme"
        ],
        prettierConfigFile: "./.prettierrc",
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
