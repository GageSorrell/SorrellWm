/**
 * Ink UI component for completion menu.
 *
 * @module @sorrell/ink-ui/CompletionMenu
 *
 * @file      CompletionMenu.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import * as React from "react";
import { useTheme } from "./Theme.tsx";

/** {@inheritDoc CompletionMenu} */
export interface CompletionMenuProps
{
    readonly Items: ReadonlyArray<string>;
    readonly SelectedIndex?: number;
}

export/**
       * Displays a small suggestion list for an input or editor.
       *
       * @category Input
       * @since 1.0.0
       */
const CompletionMenu = ({
    Items,
    SelectedIndex = 0
}: CompletionMenuProps): React.ReactNode =>
{
    const Theme = useTheme();

    return (
        <Ink.Box
            borderColor={ Theme.BorderActive }
            borderStyle="round"
            flexDirection="column"
            paddingX={ 1 }>
            { Items.map((Item: string, Index: number) => (
                <Ink.Text
                    color={ Index === SelectedIndex ? Theme.Primary : Theme.Text }
                    key={ Item }>
                    { Index === SelectedIndex ? "› " : "  " }${ Item }
                </Ink.Text>
            )) }
        </Ink.Box>
    );
};
