/**
 * ES Lint config used by SorrellWm.
 *
 * @file      index.js
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2024—2026 Gage Sorrell
 * @license   MIT
 */

import { defineConfig, globalIgnores } from "eslint/config";

import JavaScript from "@eslint/js";
import Stylistic from "@stylistic/eslint-plugin";
import Jsdoc from "eslint-plugin-jsdoc";
import React from "eslint-plugin-react";
import ReactHooks from "eslint-plugin-react-hooks";
import Tsdoc from "eslint-plugin-tsdoc";
import TypeScriptEslint from "typescript-eslint";

export default defineConfig(
    globalIgnores(
        [
            "**/Distribution/*",
            "**/node_modules/*",
            "**/dist/*",
            "**/Intermediate/*"
        ]
    ),
    {
        extends:
        [
            JavaScript.configs.recommended,
            TypeScriptEslint.configs.recommended
        ],
        files:
        [
            "**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}"
        ],
        languageOptions:
        {
            ecmaVersion: 2022,
            parserOptions:
            {
                ecmaFeatures:
                {
                    jsx: true
                }
            },
            sourceType: "module"
        },
        plugins:
        {
            "@stylistic": Stylistic,
            jsdoc: Jsdoc,
            react: React,
            "react-hooks": ReactHooks,
            tsdoc: Tsdoc
        },
        rules:
        {
            "jsdoc/check-access": "error",
            "jsdoc/check-alignment": "error",
            "jsdoc/check-indentation": "off",
            "jsdoc/check-line-alignment": "error",
            "jsdoc/check-param-names": "error",
            "jsdoc/check-property-names": "error",
            "jsdoc/check-syntax": "error",
            "jsdoc/check-tag-names":
            [
                "error",
                {
                    definedTags: [ "note" ],
                    // This was previously set to `true` to address
                    // an issue of which I no longer remember the
                    // details. I have now set it to `false` so that
                    // `@property` works on JSDoc comments of types.
                    typed: false
                    // typed: true
                }
            ],
            "jsdoc/check-template-names": "error",
            "jsdoc/check-types": "error",
            "jsdoc/check-values": "error",
            "jsdoc/convert-to-jsdoc-comments": "off",
            "jsdoc/empty-tags": "error",
            "jsdoc/escape-inline-tags": "error",
            "jsdoc/implements-on-classes": "error",
            "jsdoc/imports-as-dependencies": "error",
            "jsdoc/informative-docs": "error",
            "jsdoc/lines-before-block": "error",
            "jsdoc/match-description": "error",
            "jsdoc/match-name": "off",
            "jsdoc/multiline-blocks": "error",
            "jsdoc/no-bad-blocks": "error",
            "jsdoc/no-blank-block-descriptions": "error",
            "jsdoc/no-blank-blocks": "error",
            "jsdoc/no-defaults": "error",
            "jsdoc/no-missing-syntax": "off",
            "jsdoc/no-multi-asterisks": "error",
            "jsdoc/no-restricted-syntax": "off",
            "jsdoc/no-types": "off",
            "jsdoc/no-undefined-types": "off",
            "jsdoc/prefer-import-tag": "error",
            "jsdoc/reject-any-type": "error",
            "jsdoc/reject-function-type": "error",
            "jsdoc/require-asterisk-prefix": "error",
            "jsdoc/require-description":
            [
                "error",
                {
                    checkGetters: false
                }
            ],
            "jsdoc/require-description-complete-sentence": "off",
            "jsdoc/require-example": "off",
            "jsdoc/require-file-overview": "error",
            "jsdoc/require-hyphen-before-param-description":
            [
                "error",
                "always"
            ],
            "jsdoc/require-jsdoc":
            [
                "error",
                {
                    contexts:
                    [
                        "ExportNamedDeclaration > TSTypeAliasDeclaration",
                        "ExportNamedDeclaration > TSInterfaceDeclaration",
                        "ExportNamedDeclaration > TSEnumDeclaration",
                        "ExportNamedDeclaration > VariableDeclaration",
                        "ExportNamedDeclaration > FunctionDeclaration",
                        "ExportNamedDeclaration > ClassDeclaration"
                    ]
                }
            ],
            "jsdoc/require-next-description": "error",
            "jsdoc/require-next-type": "error",
            "jsdoc/require-param": "off",
            "jsdoc/require-param-description": "error",
            "jsdoc/require-param-name": "off",
            "jsdoc/require-param-type": "off",
            "jsdoc/require-property": "error",
            "jsdoc/require-property-description": "error",
            "jsdoc/require-property-name": "error",
            "jsdoc/require-property-type": "error",
            "jsdoc/require-rejects": "off",
            "jsdoc/require-returns": "off",
            "jsdoc/require-returns-check": "error",
            "jsdoc/require-returns-description": "error",
            "jsdoc/require-returns-type": "error",
            "jsdoc/require-tags": "off",
            "jsdoc/require-template": "off",
            "jsdoc/require-template-description": "off",
            "jsdoc/require-throws": "error",
            "jsdoc/require-throws-description": "error",
            "jsdoc/require-throws-type": "error",
            "jsdoc/require-yields": "error",
            "jsdoc/require-yields-check": "error",
            "jsdoc/require-yields-description": "error",
            "jsdoc/require-yields-type": "error",
            "jsdoc/sort-tags":
            [
                "error",
                {
                    reportIntraTagGroupSpacing: false,
                    reportTagGroupSpacing: false,
                    tagSequence:
                    [
                        {
                            tags:
                            [
                                "file",
                                "author",
                                "copyright",
                                "license"
                            ]
                        }
                    ]
                }
            ],
            "jsdoc/tag-lines": "off",
            "jsdoc/text-escaping": "off",
            "jsdoc/ts-method-signature-style": "error",
            "jsdoc/ts-no-empty-object-type": "error",
            "jsdoc/ts-no-unnecessary-template-expression": "error",
            "jsdoc/ts-prefer-function-type": "error",
            "jsdoc/type-formatting": "off",
            "jsdoc/valid-types": "error",

            "@stylistic/array-bracket-spacing":
            [
                "error",
                "always"
            ],
            "@stylistic/arrow-parens":
            [
                "error",
                "always"
            ],
            "@stylistic/arrow-spacing":
            [
                "error",
                {
                    after: true,
                    before: true
                }
            ],
            "@stylistic/brace-style":
            [
                "error",
                "allman",
                {
                    allowSingleLine: true
                }
            ],
            "@stylistic/comma-dangle":
            [
                "error",
                "never"
            ],
            "@stylistic/comma-spacing":
            [
                "error",
                {
                    after: true,
                    before: false
                }
            ],
            "@stylistic/dot-location":
            [
                "error",
                "property"
            ],
            "@stylistic/eol-last":
            [
                "error",
                "always"
            ],
            "@stylistic/function-call-spacing":
            [
                "error",
                "never"
            ],
            "@stylistic/indent":
            [
                "error",
                4
            ],
            "@stylistic/jsx-curly-spacing":
            [
                "error",
                {
                    when: "always"
                }
            ],
            "@stylistic/jsx-max-props-per-line":
            [
                "error",
                {
                    maximum: 1
                }
            ],
            "@stylistic/max-len":
            [
                "error",
                {
                    code: 110,
                    // Ignore the end of import statements because the
                    // path might be long.
                    ignorePattern: "\\{[^,]*\\bfrom\\b\\s*\"[^\"]*\";"
                }
            ],
            "@stylistic/no-trailing-spaces":
            [
                "error",
                {
                    ignoreComments: true
                }
            ],
            "@stylistic/semi":
            [
                "error",
                "always"
            ],

            "@typescript-eslint/array-type":
            [
                "error",
                {
                    default: "generic"
                }
            ],
            "@typescript-eslint/consistent-type-imports":
            [
                "error",
                {
                    prefer: "type-imports"
                }
            ],
            "@typescript-eslint/naming-convention":
            [
                "error",
                {
                    filter:
                    {
                        match: true,
                        regex: "^_"
                    },
                    format:
                    [
                        "PascalCase",
                        "UPPER_CASE"
                    ],
                    leadingUnderscore: "require",
                    selector: "typeAlias"
                },
                {
                    custom:
                    {
                        match: true,
                        regex: "^(?:[A-Z][a-z].*|[A-Z][A-Z0-9_]*)$"
                    },
                    format:
                    [
                        "PascalCase",
                        "UPPER_CASE"
                    ],
                    selector: "typeAlias"
                },
                {
                    custom:
                    {
                        match: true,
                        regex: "^(?:[AEKR]|[A-Z][a-z].+)$"
                    },
                    format:
                    [
                        "PascalCase"
                    ],
                    selector: "typeParameter"
                },
                {
                    custom:
                    {
                        match: true,
                        regex: "^[A-Z][a-z].+"
                    },
                    format:
                    [
                        "PascalCase"
                    ],
                    leadingUnderscore: "allow",
                    selector: "typeLike"
                },
                {
                    format:
                    [
                        "PascalCase",
                        "camelCase"
                    ],
                    leadingUnderscore: "allow",
                    selector: "parameter"
                },
                {
                    format:
                    [
                        "PascalCase",
                        "camelCase"
                    ],
                    leadingUnderscore: "allow",
                    selector: "variableLike"
                }
            ],
            "@typescript-eslint/no-empty-object-type": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-namespace": "off",
            "@typescript-eslint/no-unused-vars":
            [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_$"
                }
            ],
            "@typescript-eslint/typedef":
            [
                "error",
                {
                    arrayDestructuring: false,
                    arrowParameter: true,
                    memberVariableDeclaration: true,
                    objectDestructuring: false,
                    parameter: true,
                    propertyDeclaration: true,
                    variableDeclaration: false,
                    variableDeclarationIgnoreFunction: true
                }
            ],

            curly:
            [
                "error",
                "all"
            ],
            "no-console": "error",
            "no-multiple-empty-lines":
            [
                "error",
                {
                    max: 1,
                    maxBOF: 0,
                    maxEOF: 1
                }
            ],
            "quote-props":
            [
                "error",
                "as-needed"
            ],
            quotes:
            [
                "error",
                "double"
            ],
            "react-hooks/exhaustive-deps": "error",
            "react-hooks/rules-of-hooks": "error",
            "react/jsx-sort-props":
            [
                "error",
                {
                    ignoreCase: false
                }
            ],
            "require-yield": "off",
            "sort-imports":
            [
                "error",
                {
                    ignoreCase: false,
                    ignoreDeclarationSort: false,
                    ignoreMemberSort: false,
                    memberSyntaxSortOrder:
                    [
                        "none",
                        "all",
                        "multiple",
                        "single"
                    ]
                }
            ],
            "sort-keys":
            [
                "error",
                "asc",
                {
                    allowLineSeparatedGroups: true,
                    caseSensitive: true,
                    minKeys: 2,
                    natural: false
                }
            ]
        },
        settings:
        {
            jsdoc:
            {
                mode: "typescript"
            }
        }
    }
);
