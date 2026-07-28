/**
 * The entrypoint of the frontend.
 *
 * @module @sorrell/wm/Renderer/Main
 *
 * @file      Main.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Root } from "./Root.js";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const rootElement: HTMLElement | null = document.querySelector("#root");

if (rootElement === null)
{
    throw new Error("The renderer root element was not found.");
}

createRoot(rootElement).render(
    <StrictMode>
        <Root />
    </StrictMode>
);
