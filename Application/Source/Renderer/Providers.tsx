/* File:      Providers.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { PropsWithChildren, ReactNode } from "react";
import { CommandsProvider } from "./Command";
import { DummyWindowProvider } from "./DummyWindow";
import { EventProvider } from "./Event";
import { FluentThemeProvider } from "./Utility/Theme";
import { SettingsProvider } from "./Settings";
import { ShortcutProvider } from "./Keybind";
import { ToastProvider } from "./Toast";

export const Providers = ({ children }: PropsWithChildren): ReactNode =>
{
    return (
        <EventProvider>
            <DummyWindowProvider>
                <FluentThemeProvider>
                    <ToastProvider>
                        <SettingsProvider>
                            <ShortcutProvider>
                                <CommandsProvider>
                                    { children }
                                </CommandsProvider>
                            </ShortcutProvider>
                        </SettingsProvider>
                    </ToastProvider>
                </FluentThemeProvider>
            </DummyWindowProvider>
        </EventProvider>
    );
};
