/* File:      App.test.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import "@testing-library/jest-dom";
import { App } from "../Renderer/App";
import { render } from "@testing-library/react";

describe("App", () =>
{
    it("should render", () =>
    {
        expect(render(<App />)).toBeTruthy();
    });
});
