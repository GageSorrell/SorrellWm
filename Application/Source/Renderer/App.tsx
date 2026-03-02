/* File:    App.tsx
 * Author:  Gage Sorrell <gage@sorrell.sh>
 * License: MIT
 */

import "./App.css";

import { Providers } from "./Providers";
import type { ReactNode } from "react";
import { Routes } from "./Router";

export const App = (): ReactNode =>
{
    return (
        <Providers>
            <Routes />
        </Providers>
    );
};
