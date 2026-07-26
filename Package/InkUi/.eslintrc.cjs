module.exports = {
    extends: [ "../../Configuration/.eslintrc.cjs" ],
    overrides: [
        {
            files: [ "Showcase/Stories/**/*.ts", "Showcase/Stories/**/*.tsx" ],
            rules: {
                "@stylistic/max-len": "off"
            }
        }
    ],
    rules: {
        "@typescript-eslint/typedef": "off",
        "jsdoc/no-blank-blocks": "off",
        "jsdoc/require-description": "off",
        "jsdoc/require-jsdoc": "off",
        "jsdoc/require-throws": "off",
        "sort-imports": "off",
        "sort-keys": "off"
    }
};
