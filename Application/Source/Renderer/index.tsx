/* File:      index.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

import { type Root, createRoot } from "react-dom/client";
import { App } from "./App";

const Container: HTMLElement = document.getElementById("root") as HTMLElement;
const Root: Root = createRoot(Container);

Root.render(<App />);
