/**
 * @module @sorrell/wm/Test/BrowserWindowFocusPreview
 *
 * @file      BrowserWindowFocusPreview.Test.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    GetFocusPreviewWindowSpec,
    Key
} from "../../Source/Main/BrowserWindow.ts";
import { Box } from "@sorrell/math";
import { describe, expect, it, vi } from "vitest";

vi.mock("electron", () =>
{
    const Electron = {
        app: { isPackaged: true },
        BrowserWindow: class { },
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
});
