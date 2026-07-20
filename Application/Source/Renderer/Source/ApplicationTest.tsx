/**
 *
 *
 * @module @sorrell/wm/Renderer/ApplicationTest
 *
 * @file      ApplicationTest.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { Application } from "./Application.js";

describe("Application", () =>
{
    it("renders the runtime status and reaches the preload bridge", async () =>
    {
        render(<Application />);

        expect(screen.getByText("Effect runtime ready")).toBeInTheDocument();
        expect(screen.getByText("win32")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: /check preload bridge/i }));

        expect(await screen.findByRole("button", { name: /pong/i })).toBeInTheDocument();
    });
});
