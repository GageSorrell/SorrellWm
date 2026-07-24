/**
 * Overlay component tests.
 *
 * @module @sorrell/ink-ui/Test/Overlay
 *
 * @file      Overlay.test.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { describe, expect, it } from "vitest";
import { render } from "ink-testing-library";
import {
    ConfirmOverlay,
    HelpOverlay,
    Overlay,
    PickerOverlay,
    ThemePickerOverlay,
    ThemeProvider
} from "../Source/index.js";

const Render = (Value: React.ReactElement): string =>
    render(<ThemeProvider>{ Value }</ThemeProvider>).lastFrame() ?? "";

describe("overlay components", () =>
{
    it("Overlay renders its title and content", () =>
    {
        const Value = Render(<Overlay Title="Modal">Content</Overlay>);
        expect(Value).toContain("Modal");
        expect(Value).toContain("Content");
    });

    it("ConfirmOverlay renders its decision", () =>
    {
        expect(Render(<ConfirmOverlay
            Message="Continue?"
            OnCancel={ () => undefined }
            OnConfirm={ () => undefined } />)).toContain("Continue?");
    });

    it("HelpOverlay renders shortcut entries", () =>
    {
        expect(Render(<HelpOverlay Sections={ [ {
            Entries: [ { Description: "Close", Keys: "Esc" } ],
            Title: "Navigation"
        } ] } />)).toContain("Esc");
    });

    it("PickerOverlay renders available items", () =>
    {
        expect(Render(<PickerOverlay
            Items={ [ { Label: "Alpha", Value: "alpha" } ] }
            OnSelect={ () => undefined }
            Searchable={ false }
            Title="Pick" />)).toContain("Alpha");
    });

    it("ThemePickerOverlay renders built-in themes", () =>
    {
        expect(Render(<ThemePickerOverlay OnSelect={ () => undefined } />))
            .toContain("Tokyo Night");
    });
});
