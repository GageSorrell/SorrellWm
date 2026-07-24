/**
 * Focus and command showcase for `@sorrell/ink-ui`.
 *
 * @module @sorrell/ink-ui/Showcase/InteractionExample
 *
 * @file      InteractionExample.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Box, Text } from "ink";
import * as React from "react";
import {
    Command,
    CommandScope,
    Focusable,
    type FocusableState,
    FocusScope,
    InteractionProvider,
    Shortcut,
    useCommandManager
} from "../Source/Interaction/index.js";

const ShortcutSummary = (): React.ReactNode =>
{
    const { Shortcuts } = useCommandManager();
    return (
        <Text dimColor>
            { Shortcuts.map((Item) =>
                `${ Item.Keys.join("/") }: ${ Item.Label ?? Item.Command }`
            ).join(" · ") }
        </Text>
    );
};

/**
 * Demonstrates scoped focus, command bubbling, and discoverable shortcuts.
 *
 * @category Showcase
 * @since 1.0.0
 */
export const InteractionExample = (): React.ReactNode =>
{
    const [ LastAction, SetLastAction ] = React.useState("None");

    return (
        <InteractionProvider InitialFocus="first">
            <Command
                Handler={ () => SetLastAction("Saved") }
                Id="save" />
            <Shortcut
                Command="save"
                Description="Save the current value"
                Keys="Ctrl+S"
                Label="Save" />
            <CommandScope Id="fields">
                <FocusScope Id="field-focus">
                    <Box flexDirection="column">
                        <Focusable Id="first">
                            { ({ Focused }) => (
                                <Text { ...(Focused ? { color: "cyan" } : {}) }>
                                    { Focused ? "› " : "  " }First field
                                </Text>
                            ) }
                        </Focusable>
                        <Focusable Id="second">
                            { ({ Focused }: FocusableState) => (
                                <Text { ...(Focused ? { color: "cyan" } : {}) }>
                                    { Focused ? "› " : "  " }Second field
                                </Text>
                            ) }
                        </Focusable>
                    </Box>
                </FocusScope>
            </CommandScope>
            <Text>Last command: { LastAction }</Text>
            <ShortcutSummary />
            <Text dimColor>Use Tab/Shift+Tab and Ctrl+S.</Text>
        </InteractionProvider>
    );
};
