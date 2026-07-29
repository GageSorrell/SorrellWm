/**
 * Monorepo-wide ESLint configuration.
 *
 * @file      .eslintrc.cjs
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 *
 * @see {@link ./Package/EsLintConfigSorrell/index.cjs} The base config used herein.
 */

/* eslint-disable-next-line no-undef */
module.exports = {
    extends: [ "@sorrell/eslint-config" ],
    root: true,
    rules:
    {
        "jsdoc/no-blank-block-descriptions": "off",
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
                            "module",
                            "internal",
                            "file",
                            "author",
                            "copyright",
                            "license"
                        ]
                    }
                ]
            }
        ]
    }
};
