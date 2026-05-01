/**
 * @file      main.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { StorybookConfig } from "@storybook/react-vite";

const Configuration: StorybookConfig =
    {
        stories:
        [
            "../Source/**/*.mdx",
            "../Source/**/*.stories.@(ts|tsx)"
        ],

        framework:
        {
            name: "@storybook/react-vite",
            options: { }
        }
    };

export default Configuration;
