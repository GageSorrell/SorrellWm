/**
 * @file      App.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
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
