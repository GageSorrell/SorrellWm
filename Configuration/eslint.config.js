/**
 * Monorepo-wide ESLint configuration.
 *
 * @file      eslint.config.js
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 *
 * @see {@link ../Package/EsLintConfigSorrell/index.js} The base config used herein.
 */

import { defineConfig, globalIgnores } from "eslint/config";
import SorrellConfig from "@sorrell/eslint-config";

export default defineConfig(
    globalIgnores([ "**/Package/Old/**" ]),
    SorrellConfig,
    {
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
    }
);
