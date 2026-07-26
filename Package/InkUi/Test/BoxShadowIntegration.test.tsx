/**
 * Box shadow integration tests.
 *
 * @module @sorrell/ink-ui/Test/BoxShadowIntegration
 *
 * @file      BoxShadowIntegration.test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Ink from "ink";
import { render } from "ink-testing-library";
import { describe, expect, it, vi } from "vitest";
import { Box } from "../Source/Box/index.js";

vi.mock("../Source/Support/Query.js", () => ({
    QueryTerminalSupport: async () => ({
        BackgroundColor: { Blue: 48, Green: 40, Red: 32 },
        CellSizePixels: { Height: 16, Width: 8 },
        Sixel: true
    })
}));

const Tree = (
    <Ink.Box padding={ 2 }>
        <Box elevation={ 3 }
            height={ 3 }
            shadowColor="#101820"
            width={ 10 }
            zOrder={ 4 }>
            <Ink.Text>Shadow</Ink.Text>
        </Box>
    </Ink.Box>
);

describe("Box shadow integration", () =>
{
    it("emits a Sixel surface when terminal requirements are available", async () =>
    {
        const App = render(Tree);
        Object.defineProperty(App.stdout, "rows", { configurable: true, value: 40 });
        App.rerender(Tree);

        await new Promise((Resolve) => setImmediate(Resolve));
        await new Promise((Resolve) => setImmediate(Resolve));
        await new Promise((Resolve) => setImmediate(Resolve));

        expect(App.stdout.frames.some((Frame: string) => Frame.includes("\u001BP0;1;q")))
            .toBe(true);
    });
});
