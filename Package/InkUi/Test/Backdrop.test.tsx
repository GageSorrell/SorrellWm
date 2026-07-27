/**
 * Backdrop provider tests.
 *
 * @module @sorrell/ink-ui/Test/Backdrop
 *
 * @file      Backdrop.test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import { render } from "ink-testing-library";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
    BackdropProvider,
    DarkenTerminalBackground
} from "../Source/Backdrop/index.js";
import { Box } from "../Source/Box/index.js";

const Mocks = vi.hoisted(() => ({
    QueryTerminalSupport: vi.fn()
}));

vi.mock("../Source/Support/Query.js", () => ({
    QueryTerminalSupport: Mocks.QueryTerminalSupport
}));

const Flush = (): Promise<void> => new Promise((Resolve) => setImmediate(Resolve));

describe("BackdropProvider", () =>
{
    beforeEach(() =>
    {
        Mocks.QueryTerminalSupport.mockReset();
    });

    it("uses a stronger darkening percentage for very dark terminal colors", () =>
    {
        expect(DarkenTerminalBackground({ Blue: 128, Green: 128, Red: 128 }))
            .toBe("rgb(105, 105, 105)");
        expect(DarkenTerminalBackground({ Blue: 20, Green: 20, Red: 20 }))
            .toBe("rgb(11, 11, 11)");
    });

    it("paints the backdrop while Boxes default to the original terminal color", async () =>
    {
        Mocks.QueryTerminalSupport.mockResolvedValue({
            BackgroundColor: { Blue: 60, Green: 50, Red: 40 }
        });
        let DefaultBox: Ink.DOMElement | null = null;
        let ExplicitBox: Ink.DOMElement | null = null;

        render(
            <BackdropProvider>
                <Box ref={ (Value) => {DefaultBox = Value;} }>
                    <Ink.Text>Default</Ink.Text>
                </Box>
                <Box backgroundColor="#abcdef"
                    ref={ (Value) => {ExplicitBox = Value;} }>
                    <Ink.Text>Explicit</Ink.Text>
                </Box>
            </BackdropProvider>
        );

        await Flush();
        await Flush();

        expect(DefaultBox).not.toBeNull();
        expect((DefaultBox as unknown as Ink.DOMElement).style.backgroundColor)
            .toBe("rgb(40, 50, 60)");
        expect((DefaultBox as unknown as Ink.DOMElement).parentNode?.style.backgroundColor)
            .toBe("rgb(33, 41, 49)");
        expect((ExplicitBox as unknown as Ink.DOMElement).style.backgroundColor)
            .toBe("#abcdef");
        expect(Mocks.QueryTerminalSupport).toHaveBeenCalledTimes(1);
    });

    it("uses an explicit backdrop color without changing the Box default", async () =>
    {
        Mocks.QueryTerminalSupport.mockResolvedValue({
            BackgroundColor: { Blue: 30, Green: 20, Red: 10 }
        });
        let Child: Ink.DOMElement | null = null;

        render(
            <BackdropProvider backgroundColor="#123456">
                <Box ref={ (Value) => {Child = Value;} } />
            </BackdropProvider>
        );

        await Flush();
        await Flush();

        expect((Child as unknown as Ink.DOMElement).style.backgroundColor)
            .toBe("rgb(10, 20, 30)");
        expect((Child as unknown as Ink.DOMElement).parentNode?.style.backgroundColor)
            .toBe("#123456");
    });

    it("defaults a standalone Box to a detected terminal background", async () =>
    {
        Mocks.QueryTerminalSupport.mockResolvedValue({
            BackgroundColor: { Blue: 90, Green: 80, Red: 70 }
        });
        let Child: Ink.DOMElement | null = null;

        render(<Box ref={ (Value) => {Child = Value;} } />);
        await Flush();
        await Flush();

        expect((Child as unknown as Ink.DOMElement).style.backgroundColor)
            .toBe("rgb(70, 80, 90)");
    });

    it("does not apply either background when terminal detection fails", async () =>
    {
        Mocks.QueryTerminalSupport.mockResolvedValue({ BackgroundColor: undefined });
        let Child: Ink.DOMElement | null = null;

        render(
            <BackdropProvider backgroundColor="#123456">
                <Box ref={ (Value) => {Child = Value;} } />
            </BackdropProvider>
        );

        await Flush();
        await Flush();

        expect((Child as unknown as Ink.DOMElement).style.backgroundColor).toBeUndefined();
        expect((Child as unknown as Ink.DOMElement).parentNode?.style.backgroundColor)
            .toBeUndefined();
    });
});
