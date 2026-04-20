/**
 * @file      index.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */

import { type Root, createRoot } from "react-dom/client";
import { App } from "./App";

const Container: HTMLElement = document.getElementById("root") as HTMLElement;
const Root: Root = createRoot(Container);

Root.render(<App />);
