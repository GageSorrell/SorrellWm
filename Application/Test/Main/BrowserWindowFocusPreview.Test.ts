/**
 * Tests window specifications for occluded Focus target previews.
 *
 * @module @sorrell/wm/Test/BrowserWindowFocusPreview
 *
 * @file      BrowserWindowFocusPreview.Test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    GetFocusPreviewWindowSpec,
    GetInsertTargetWindowSpec,
    Key
} from "../../Source/Main/BrowserWindow.ts";
import { describe, expect, it, vi } from "vitest";
import { Box } from "@sorrell/math";

vi.mock("electron", () =>
{
    const Electron = {
        BrowserWindow: class { },
        app: { isPackaged: true },
        screen: {
            screenToDipRect: (
                _Window: null,
                Rectangle: Electron.Rectangle
            ): Electron.Rectangle => Rectangle
        },
        shell: { openExternal: (): void => undefined }
    };

    return {
        ...Electron,
        default: Electron
    };
});

describe("BrowserWindow Focus preview specification", () =>
{
    it("creates a frameless click-through tool window at the target bounds", () =>
    {
        const Spec = GetFocusPreviewWindowSpec(
            Key.FocusPreviewRight,
            Box.Box(100, 400, 300, 200)
        );

        expect(Spec).toMatchObject({
            IgnoreMouseEvents: true,
            Key: "FocusPreviewRight",
            Options: {
                alwaysOnTop: true,
                focusable: false,
                frame: false,
                hasShadow: false,
                height: 200,
                resizable: false,
                roundedCorners: false,
                skipTaskbar: true,
                transparent: true,
                type: "toolbar",
                width: 200,
                x: 200,
                y: 100
            },
            ShowWhenReady: false
        });
    });

    it("uses the same non-activating surface for a tiled panel highlight", () =>
    {
        const Spec = GetFocusPreviewWindowSpec(
            Key.TiledFocusPanelPreview,
            Box.Box(20, 620, 420, 120)
        );

        expect(Spec).toMatchObject({
            IgnoreMouseEvents: true,
            Key: "TiledFocusPanelPreview",
            Options: {
                alwaysOnTop: true,
                focusable: false,
                frame: false,
                height: 400,
                skipTaskbar: true,
                transparent: true,
                width: 500,
                x: 120,
                y: 20
            },
            ShowWhenReady: false
        });
    });

    it("creates a taskbar-free acrylic Insert target at the selected tile", () =>
    {
        const Spec = GetInsertTargetWindowSpec(
            Box.Box(40, 720, 440, 120)
        );

        expect(Spec).toMatchObject({
            Key: "InsertTarget",
            Options: {
                alwaysOnTop: true,
                backgroundMaterial: "acrylic",
                frame: false,
                height: 400,
                resizable: false,
                roundedCorners: false,
                skipTaskbar: true,
                type: "toolbar",
                width: 600,
                x: 120,
                y: 40
            },
            ShowWhenReady: true
        });
    });
});
