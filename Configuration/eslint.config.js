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

import SorrellConfig from "@sorrell/eslint-config";
import { defineConfig } from "eslint/config";

export default defineConfig(
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
