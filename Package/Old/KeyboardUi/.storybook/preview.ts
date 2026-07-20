/**
 * @file      preview.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { Preview } from "@storybook/react-vite";

const PreviewConfiguration: Preview = {
    parameters:
    {
        controls:
        {
            matchers:
            {
                color: /(background|color)$/i,
                date: /Date$/i
            }
        }
    }
};

export default PreviewConfiguration;
