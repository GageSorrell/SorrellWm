/**
 * Package-specific lint policy.
 *
 * The shared rules remain active. These overrides match the relaxations
 * already used by most other monorepo packages (see Package/Log,
 * Package/WindowsUi, Package/SettingsUi): they avoid requiring API-style
 * JSDoc on internal helpers, and allow declaration order to follow meaning
 * (for example, matching `package.json`'s conventional field order) rather
 * than strict alphabetization.
 */

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
    }
);
