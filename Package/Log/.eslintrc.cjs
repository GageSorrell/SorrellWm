/**
 * Package-specific lint policy.
 *
 * The shared rules remain active. These overrides permit stable wire-schema
 * `_tag` fields to lead records, keep type/value imports readable around the
 * Effect namespaces, and avoid requiring API-style JSDoc on private helpers
 * and test fixtures.
 */
module.exports = {
    extends: [ "../../Configuration/.eslintrc.cjs" ],
    rules: {
        "@typescript-eslint/typedef": "off",
        "jsdoc/no-blank-blocks": "off",
        "jsdoc/require-description": "off",
        "jsdoc/require-jsdoc": "off",
        "jsdoc/require-throws": "off",
        "no-control-regex": "off",
        "sort-imports": "off",
        "sort-keys": "off"
    }
};
