import { defineConfig } from "eslint/config";

import MonorepoConfig from "../../Configuration/eslint.config.js";

export default defineConfig(
    MonorepoConfig,
    {
        rules:
        {
            "@typescript-eslint/typedef": "off",
            "jsdoc/no-blank-blocks": "off",
            "jsdoc/require-description": "off",
            "jsdoc/require-jsdoc": "off",
            "jsdoc/require-throws": "off",
            "sort-imports": "off",
            "sort-keys": "off"
        }
    },
    {
        files:
        [
            "Showcase/Stories/**/*.ts",
            "Showcase/Stories/**/*.tsx"
        ],
        rules:
        {
            "@stylistic/max-len": "off"
        }
    }
);
