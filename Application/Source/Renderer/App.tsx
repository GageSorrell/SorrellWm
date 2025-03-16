/* File:    App.tsx
 * Author:  Gage Sorrell <gage@sorrell.sh>
 * License: MIT
 */

import "./App.css";

import { FluentThemeProvider } from "./Utility/Theme";
import type { ReactNode } from "react";
import { Routes } from "./Router";
import { ShortcutProvider } from "react-keybind";
import { StoreProvider } from "./Store";

export const App = (): ReactNode =>
{
    return (
        <StoreProvider>
            <ShortcutProvider>
                <FluentThemeProvider>
                    <Routes/>
                </FluentThemeProvider>
            </ShortcutProvider>
        </StoreProvider>
    );
};
