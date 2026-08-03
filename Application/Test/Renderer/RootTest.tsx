/**
 * Tests root renderer theme selection and application composition.
 *
 * @module @sorrell/wm/Renderer/Source/RootTest
 *
 * @file      RootTest.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Root } from "../../Source/Renderer/Root.js";

describe("Root", () =>
{
    it("renders the application inside a Fluent provider", () =>
    {
        const { container } = render(<Root />);

        expect(container.querySelector(".fui-FluentProvider")).toBeInTheDocument();
        expect(screen.getByText("Window manager foundation")).toBeInTheDocument();
    });
});
