/* File:      Providers.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { PropsWithChildren, ReactNode } from "react";
import { CommandsProvider } from "./Command";
import { FluentThemeProvider } from "./Utility/Theme";
import { Settings } from "./Settings";
import { ShortcutProvider } from "./Keybind";
import { StoreProvider } from "./Store";

export const Providers = ({ children }: PropsWithChildren): ReactNode =>
{
    return (
        <StoreProvider>
            <Settings>
                <ShortcutProvider>
                    <CommandsProvider>
                        <FluentThemeProvider>
                            { children }
                        </FluentThemeProvider>
                    </CommandsProvider>
                </ShortcutProvider>
            </Settings>
        </StoreProvider>
    );
};
