/**
 *
 *
 * @module @sorrell/ink-ui/Test/LaTeXQuality.test
 *
 * @file      LaTeXQuality.test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/** LaTeX raster-quality regression tests. */

import { render } from "ink-testing-library";
import { describe, expect, it, vi } from "vitest";
import { LaTeX } from "../Source/LaTeX/index.js";

const Mocks = vi.hoisted(() => ({
    Props: undefined as { readonly children?: unknown; readonly rasterization?: unknown } | undefined
}));

vi.mock("../Source/Svg/index.js", () => ({
    Svg: (Props: { readonly children?: unknown; readonly rasterization?: unknown }): null =>
    {
        Mocks.Props = Props;
        return null;
    }
}));

describe("LaTeX raster quality", () =>
{
    it("scales and reinforces MathJax paths before crisp rasterization", async () =>
    {
        render(<LaTeX>{ "E = mc^2" }</LaTeX>);
        await vi.waitFor(() => expect(Mocks.Props).toBeDefined());

        const Markup: string = String(Mocks.Props?.children);
        const Width: number = Number(Markup.match(/\bwidth="([\d.]+)ex"/u)?.[1]);
        expect(Width).toBeGreaterThan(8.7);
        expect(Markup).toContain("stroke-width=\"24\"");
        expect(Markup).toContain("stroke-linejoin=\"round\"");
        expect(Markup).toContain("paint-order=\"stroke fill\"");
        expect(Mocks.Props?.rasterization).toBe("crisp");
    });

    it("allows callers to request smooth rasterization", async () =>
    {
        Mocks.Props = undefined;
        render(<LaTeX rasterization="smooth">{ "x" }</LaTeX>);
        await vi.waitFor(() => expect(Mocks.Props).toBeDefined());

        expect(Mocks.Props?.rasterization).toBe("smooth");
    });
});
