/**
 * @file      .eslintrc.cjs
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
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
            files: [ "**/*.*js" ],
            rules:
            {
                "@typescript-eslint/typedef": "off"
            }
        },
        {
            files: [ "*.json" ],
            parser: "jsonc-eslint-parser",

            plugins:
            [
                "package-json"
            ],

            extends:
            [
                "plugin:package-json/legacy-recommended"
            ],

            rules:
            {
                "package-json/bin-name-casing": "error",
                "package-json/exports-subpaths-style": "error",
                "package-json/no-empty-fields": "error",
                "package-json/no-redundant-files": "error",
                "package-json/no-redundant-publishConfig": "error",
                "package-json/order-properties": "error",
                "package-json/repository-shorthand": "error",
                "package-json/require-attribution": "error",
                "package-json/require-author": "error",
                "package-json/require-bin": "error",
                "package-json/require-bugs": "error",
                "package-json/require-bundleDependencies": "error",
                "package-json/require-contributors": "error",
                "package-json/require-cpu": "error",
                "package-json/require-dependencies": "error",
                "package-json/require-description": "error",
                "package-json/require-devDependencies": "error",
                "package-json/require-devEngines": "error",
                "package-json/require-directories": "error",
                "package-json/require-engines": "error",
                "package-json/require-exports": "error",
                "package-json/require-files": "error",
                "package-json/require-funding": "error",
                "package-json/require-homepage": "error",
                "package-json/require-keywords": "error",
                "package-json/require-license": "error",
                "package-json/require-main": "error",
                "package-json/require-man": "error",
                "package-json/require-module": "error",
                "package-json/require-name": "error",
                "package-json/require-optionalDependencies": "error",
                "package-json/require-os": "error",
                "package-json/require-packageManager": "error",
                "package-json/require-peerDependencies": "error",
                "package-json/require-private": "error",
                "package-json/require-publishConfig": "error",
                "package-json/require-repository": "error",
                "package-json/require-scripts": "error",
                "package-json/require-sideEffects": "error",
                "package-json/require-type": "error",
                "package-json/require-types": "error",
                "package-json/require-version": "error",
                "package-json/restrict-private-properties": "error",
                "package-json/restrict-top-level-properties":
                [
                    "error",
                    {
                        ban:
                        [
                            "babel",
                            "browserslist",
                            "commitlint",
                            "eslintConfig",
                            "jest",
                            "lint-staged",
                            "pnpm",
                            "prettier",
                            "release-it",
                            "renovate",
                            "stylelint",
                            "typedoc"
                        ]
                    }
                ],
                "package-json/scripts-name-casing": "error",
                "package-json/sort-collections": "error",
                "package-json/specify-peers-locally": "error",
                "package-json/unique-dependencies": "error",
                "package-json/valid-author": "error",
                "package-json/valid-bin": "error",
                "package-json/valid-bugs": "error",
                "package-json/valid-bundleDependencies": "error",
                "package-json/valid-config": "error",
                "package-json/valid-contributors": "error",
                "package-json/valid-cpu": "error",
                "package-json/valid-dependencies": "error",
                "package-json/valid-description": "error",
                "package-json/valid-devDependencies": "error",
                "package-json/valid-devEngines": "error",
                "package-json/valid-directories": "error",
                "package-json/valid-engines": "error",
                "package-json/valid-exports": "error",
                "package-json/valid-files": "error",
                "package-json/valid-funding": "error",
                "package-json/valid-homepage": "error",
                "package-json/valid-keywords": "error",
                "package-json/valid-license": "error",
                "package-json/valid-main": "error",
                "package-json/valid-man": "error",
                "package-json/valid-module": "error",
                "package-json/valid-name": "error",
                "package-json/valid-optionalDependencies": "error",
                "package-json/valid-os": "error",
                "package-json/valid-package-definition": "warn",
                "package-json/valid-packageManager": "error",
                "package-json/valid-peerDependencies": "error",
                "package-json/valid-private": "error",
                "package-json/valid-publishConfig": "error",
                "package-json/valid-repository": "error",
                "package-json/valid-repository-directory": "error",
                "package-json/valid-scripts": "error",
                "package-json/valid-sideEffects": "error",
                "package-json/valid-type": "error",
                "package-json/valid-version": "error",
                "package-json/valid-workspaces": "error"
            },
            settings:
            {
                packageJson:
                {
                    enforceForPrivate: true
                }
            }
        },
        {
            files:
            [
                "Application/Source/**/*.ts",
                "Application/Source/**/*.tsx"
            ],
            rules:
            {
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
                            regex: "^(?:Registrar|(?:H|F|I|P|T|S|A|Y|C|K|N|G)[A-Z][a-zA-Z0-9]+|[TUKYAHG])$"

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
                ]
            }
        },
        {
            files:
            [
                "Package/CliUtilities/Source/**/*.ts",
                "Package/PipeOperator/Source/**/*.ts",
                "Package/Listr/Source/**/*.ts",
                "Package/Utilities/Source/**/*.ts",
                "Package/CreateReactiveEvent/Source/**/*.ts",
                "Package/ReactiveEvent/Source/**/*.ts",
                "Package/ReactiveEvent/Source/**/*.tsx",
                "Package/ReactiveEventCli/Source/**/*.ts",
                "Package/ReactiveEventCli/Source/**/*.tsx"
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
                "Configuration/**/*.cts",
                "Package/Cli/Source/**/*.ts",
                "Package/CliUtilities/Source/**/*.ts",
                "Package/ReactiveEvent/Source/**/*.ts",
                "Package/ReactiveEventCli/Source/**/*.ts",
                "Package/ReactiveEvent/Documentation/**/*.ts",
                "Package/ReactiveEvent/Sample/**/*.ts",
                "Package/ReactiveEvent/Sample/**/*.tsx"
            ],
            rules:
            {
                "no-console": "off"
            }
        },
        {
            files: [ "Package/TagCli/**/*.ts" ],
            rules:
            {
                "jsdoc/require-jsdoc": "off"
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
        "tsdoc",
        "package-json"
    ],
    root: true,
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
                    // details.  I have now set it to `false` so that
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
        "jsdoc/require-param-type": "off",
        "jsdoc/require-property": "error",
        "jsdoc/require-property-description": "error",
        "jsdoc/require-property-name": "error",
        "jsdoc/require-property-type": "error",
        "jsdoc/require-rejects": "off",
        "jsdoc/require-returns": "error",
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
        "jsdoc/sort-tags": [
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
                    regex: "^(E|H|F|I|P|T|S|A|Y|C|K|N|G)[A-Z][a-zA-Z0-9]+$|^T|^U|^K|^Y|^A|^E|^H|^G$"
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
