/* File:    .eslintrc.js
 * Author:  Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License: MIT
 */

/* eslint-disable-next-line no-undef */
module.exports = {
    extends:
    [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    ignorePatterns:
    [
        "**/Distribution/*",
        "**/Intermediate/*",
        "**/webpack.*.js",
        "!**/.vitepress/*"
    ],
    overrides:
    [
        {
            files:
            [
                "Package/CliUtilities/Source/**/*.ts",
                "Package/Utilities/Source/**/*.ts",
                "Package/CreateElectronReactiveEvent/Source/**/*.ts",
                "Package/ElectronReactiveEvent/Source/**/*.ts",
                "Package/ElectronReactiveEvent/Source/**/*.tsx",
                "Package/ElectronReactiveEventCli/Source/**/*.ts",
                "Package/ElectronReactiveEventCli/Source/**/*.tsx"
            ],
            rules:
            {
                "@typescript-eslint/naming-convention": "off",
                "@typescript-eslint/no-namespace": "off",
                "jsdoc/require-example":
                    [
                        "error",
                        {
                            exemptNoArguments: true
                        }
                    ],
                "no-console": "off"
            }
        },
        {
            files:
            [
                "Package/Cli/Source/**/*.ts",
                "Package/CliUtilities/Source/**/*.ts",
                "Package/ElectronReactiveEvent/Source/**/*.ts",
                "Package/ElectronReactiveEventCli/Source/**/*.ts",
                "Package/ElectronReactiveEvent/Documentation/**/*.ts",
                "Package/ElectronReactiveEvent/Sample/**/*.ts",
                "Package/ElectronReactiveEvent/Sample/**/*.tsx"
            ],
            rules:
            {
                "no-console": "off"
            }
        }
    ],
    parser: "@typescript-eslint/parser",
    parserOptions:
    {
        ecmaFeatures:
        {
            jsx: true
        },
        ecmaVersion: 2022,
        sourceType: "module"
    },
    plugins:
    [
        "react",
        "react-hooks",
        "@typescript-eslint",
        "@stylistic",
        "jsdoc",
        "tsdoc"
    ],
    rules:
    {
        "jsdoc/check-access": "error",
        "jsdoc/check-alignment": "error",
        "jsdoc/check-indentation": "error",
        "jsdoc/check-line-alignment": "error",
        "jsdoc/check-param-names": "error",
        "jsdoc/check-property-names": "error",
        "jsdoc/check-syntax": "error",
        "jsdoc/check-tag-names": "error",
        "jsdoc/check-template-names": "error",
        "jsdoc/check-types": "error",
        "jsdoc/check-values": "error",
        "jsdoc/convert-to-jsdoc-comments": "error",
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
        "jsdoc/no-types": "error",
        "jsdoc/no-undefined-types": "error",
        "jsdoc/prefer-import-tag": "error",
        "jsdoc/reject-any-type": "error",
        "jsdoc/reject-function-type": "error",
        "jsdoc/require-asterisk-prefix": "error",
        "jsdoc/require-description": "error",
        "jsdoc/require-description-complete-sentence": "off",
        "jsdoc/require-example": "off",
        "jsdoc/require-file-overview": "error",
        "jsdoc/require-hyphen-before-param-description": [ "error", "always" ],
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
        "jsdoc/require-param": "error",
        "jsdoc/require-param-description": "error",
        "jsdoc/require-param-name": "error",
        "jsdoc/require-param-type": "error",
        "jsdoc/require-property": "error",
        "jsdoc/require-property-description": "error",
        "jsdoc/require-property-name": "error",
        "jsdoc/require-property-type": "error",
        "jsdoc/require-rejects": "error",
        "jsdoc/require-returns": "error",
        "jsdoc/require-returns-check": "error",
        "jsdoc/require-returns-description": "error",
        "jsdoc/require-returns-type": "error",
        "jsdoc/require-tags": "off",
        "jsdoc/require-template": "error",
        "jsdoc/require-template-description": "error",
        "jsdoc/require-throws": "error",
        "jsdoc/require-throws-description": "error",
        "jsdoc/require-throws-type": "error",
        "jsdoc/require-yields": "error",
        "jsdoc/require-yields-check": "error",
        "jsdoc/require-yields-description": "error",
        "jsdoc/require-yields-type": "error",
        "jsdoc/sort-tags": [
            "error",
            {
                reportIntraTagGroupSpacing: false,
                tags:
                [
                    "file",
                    "author",
                    "copyright",
                    "license"
                ]
            }
        ],
        "jsdoc/tag-lines":
            [
                "error",
                "always",
                {
                    count: 2,
                    tags:
                    {
                        author:
                        {
                            lines: "never"
                        },
                        copyright:
                        {
                            lines: "never"
                        },
                        file:
                        {
                            lines: "never"
                        },
                        license:
                        {
                            lines: "never"
                        }
                    }
                }
            ],
        "jsdoc/text-escaping":
            [
                "error",
                {
                    escapeMarkdown: true
                }
            ],
        "jsdoc/ts-method-signature-style": "error",
        "jsdoc/ts-no-empty-object-type": "error",
        "jsdoc/ts-no-unnecessary-template-expression": "error",
        "jsdoc/ts-prefer-function-type": "error",
        "jsdoc/type-formatting": "error",
        "jsdoc/valid-types": "error",

        "@stylistic/array-bracket-spacing": [ "error", "always" ],
        "@stylistic/arrow-parens": [ "error", "always" ],
        "@stylistic/arrow-spacing": [ "error", { after: true, before: true } ],
        "@stylistic/brace-style": [ "error", "allman", { allowSingleLine: true } ],
        "@stylistic/comma-dangle": [ "error", "never" ],
        "@stylistic/comma-spacing": [ "error", { after: true, before: false } ],
        "@stylistic/dot-location": [ "error", "property" ],
        "@stylistic/eol-last": [ "error", "always" ],
        "@stylistic/function-call-spacing": [ "error", "never" ],
        "@stylistic/indent": [ "error", 4 ],
        "@stylistic/jsx-curly-spacing": [ "error", { when: "always" } ],
        "@stylistic/jsx-max-props-per-line": [ 1, { maximum: 1 } ],
        "@stylistic/max-len":
        [
            "error",
            {
                code: 110,
                /* Ignore the end of import statements, because the path might be long.  */
                ignorePattern: "\\{[^,]*\\bfrom\\b\\s*\"[^\"]*\";"
            }
        ],
        "@stylistic/no-trailing-spaces": [ "error", { ignoreComments: true } ],
        "@stylistic/semi": [ "error", "always" ],
        "@typescript-eslint/array-type": [ "error", { default: "generic" } ],
        "@typescript-eslint/consistent-type-imports": [ "error", { prefer: "type-imports" } ],
        "@typescript-eslint/naming-convention":
        [
            "error",
            {
                custom:
                {
                    match: true,
                    regex: "^[A-Z][a-z].+"
                },
                format: [ "PascalCase" ],
                selector: "typeParameter"
            },
            {
                custom:
                {
                    match: true,
                    regex: "^(H|F|I|P|T|S|A|Y|C|K|N|G)[A-Z][a-zA-Z0-9]+$|^T|^U|^K|^Y|^A|^H|^G$"
                },
                format: [ "PascalCase" ],
                selector: "typeLike"
            },
            {
                format: [ "PascalCase", "camelCase" ],
                leadingUnderscore: "allow",
                selector: "parameter"
            },
            {
                format: [ "PascalCase", "camelCase" ],
                leadingUnderscore: "allow",
                selector: "variableLike"
            }
        ],
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
                variableDeclaration: true,
                variableDeclarationIgnoreFunction: true
            }
        ],
        curly: [ "error", "all" ],

        "no-console": [ "error" ],
        "no-multiple-empty-lines": [ "error", { max: 1, maxBOF: 0, maxEOF: 1 } ],
        "quote-props": [ "error", "as-needed" ],
        quotes: [ "error", "double" ],
        "react-hooks/exhaustive-deps": "error",
        "react-hooks/rules-of-hooks": "error",
        "react/jsx-sort-props":
        [
            "error",
            {
                ignoreCase: false
            }
        ],
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
        "import/resolver":
        {
            /* eslint-disable-next-line @stylistic/max-len */
            /* See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below */
            node:
            {
                extensions: [ ".js", ".jsx", ".ts", ".tsx", ".mts" ],
                moduleDirectory: [ "Application/node_modules", "Application/src/" ]
            },
            typescript: { }
        },
        jsdoc:
        {
            mode: "typescript"
        }
    }
};
