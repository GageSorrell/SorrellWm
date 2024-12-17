/* File:    .eslintrc.js
 * Author:  Gage Sorrell <gage@sorrell.sh>
 * License: MIT
 */

/* eslint-disable-next-line no-undef */
module.exports =
{
    extends:
    [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    ignorePatterns:
    [
        "**/Distribution/*",
        "**/Intermediate/*"
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
        "header",
        "react",
        "react-hooks",
        "@typescript-eslint",
        "@stylistic"
    ],
    rules:
    {
        "@stylistic/array-bracket-spacing": [ "error", "always" ],
        "@stylistic/arrow-parens": [ "error", "always" ],
        "@stylistic/arrow-spacing": [ "error", { after: true, before: true } ],
        "@stylistic/brace-style": [ "error", "allman", { allowSingleLine: false } ],
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
        "brace-style":
        [
            "error",
            "allman",
            { allowSingleLine: true }
        ],
        curly: [ "error", "all" ],
        // "header/header":
        // [
        //     2,
        //     "block",
        //     [
        //         { pattern: " File:  .*" },
        //         { pattern: " \\* Author:  .*"},
        //         { pattern: " \\* License: MIT" },
        //         { pattern: " " }
        //     ],
        //     2
        // ],
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
        // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
        node:
        {
            extensions: [".js", ".jsx", ".ts", ".tsx"],
            moduleDirectory: ["Application/node_modules", "Application/src/"],
        },
        // webpack:
        // {
        //     config: require.resolve("Application/.erb/configs/webpack.config.eslint.ts"),
        // },
        typescript: { },
    },
    // "import/parsers":
    // {
    //     "@typescript-eslint/parser": [ ".ts", ".tsx" ],
    // },
  },
};
