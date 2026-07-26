/**
 * Interactive Storybook-style documentation for `@sorrell/ink-ui`.
 *
 * @module @sorrell/ink-ui/Showcase
 *
 * @file      index.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import { InteractionProvider } from "../Source/Interaction/index.js";
import { MouseProvider } from "../Source/Mouse/index.js";
import { Showcase } from "./Showcase.js";
import { ThemeProvider } from "../Source/Theme.js";

Ink.render(
    <ThemeProvider>
        <InteractionProvider ShowFooter={ false }>
            <MouseProvider>
                <Showcase />
            </MouseProvider>
        </InteractionProvider>
    </ThemeProvider>,
    {
        alternateScreen: true,
        exitOnCtrlC: true
    }
);
