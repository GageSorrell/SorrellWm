import { defineConfig } from "eslint/config";
import MonorepoConfig from "../../Configuration/eslint.config.js";
export default defineConfig(
    MonorepoConfig,
    {
        rules:
        {
            "@stylistic/jsx-max-props-per-line": "off",
            "@stylistic/max-len": "off",
            "@typescript-eslint/consistent-type-imports": "off",
            "@typescript-eslint/typedef": "off",
            "curly": "off",
            "jsdoc/escape-inline-tags": "off",
            "jsdoc/lines-before-block": "off",
            "jsdoc/match-description": "off",
            "jsdoc/require-description": "off",
            "jsdoc/require-file-overview": "off",
            "jsdoc/require-jsdoc": "off",
            "jsdoc/require-throws": "off",
            "quotes": "off",
            "sort-imports": "off",
            "sort-keys": "off"
        }
    }
);
