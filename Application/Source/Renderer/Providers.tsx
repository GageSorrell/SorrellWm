/* File:      Providers.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { PropsWithChildren, ReactNode } from "react";
import { CommandsProvider } from "./Command";
import { DummyWindowProvider } from "./DummyWindow";
import { FluentThemeProvider } from "./Utility/Theme";
import { SettingsProvider } from "./Settings";
import { ShortcutProvider } from "./Keybind";
import { SorrellWmEventProvider } from "./Event";
import { ToastProvider } from "./Toast";

export const Providers = ({ children }: PropsWithChildren): ReactNode =>
{
    return (
        <SorrellWmEventProvider>
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
        </SorrellWmEventProvider>
    );
};
