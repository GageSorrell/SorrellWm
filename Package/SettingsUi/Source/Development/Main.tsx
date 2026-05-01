/**
 * @file      Main.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { DevelopmentApp } from "./App";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const RootElement: HTMLElement | null = document.getElementById("Root");

if (RootElement === null)
{
    throw new Error("The root element was not found.");
}

createRoot(RootElement).render(
    <StrictMode>
        <DevelopmentApp />
    </StrictMode>
);
