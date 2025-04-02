/* File:      BrowserWindow.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import type { Event, Point, Rectangle } from "electron";

export type FBrowserWindowEventType =
    | "always-on-top-changed"
    | "app-command"
    | "blur"
    | "close"
    | "closed"
    | "enter-full-screen"
    | "enter-html-full-screen"
    | "focus"
    | "hide"
    | "leave-full-screen"
    | "leave-html-full-screen"
    | "maximize"
    | "minimize"
    | "move"
    | "moved"
    | "new-window-for-tab"
    | "page-title-updated"
    | "ready-to-show"
    | "resize"
    | "resized"
    | "responsive"
    | "restore"
    | "rotate-gesture"
    | "session-end"
    | "sheet-begin"
    | "sheet-end"
    | "show"
    | "swipe"
    | "system-context-menu"
    | "unmaximize"
    | "unresponsive"
    | "will-move"
    | "will-resize";

export type TBrowserWindowEventCallback<T extends Array<unknown> = Array<unknown>> =
    (Event: Event, ...Arguments: T) => Promise<void>;

export type FBrowserWindowEvents = Partial<{
    "always-on-top-changed": (Event: Event, IsAlwaysOnTop: boolean) => Promise<void>;
    "app-command": (Event: Event, Command: string) => Promise<void>;
    "blur": () => Promise<void>;
    "close": (Event: Event) => Promise<void>;
    "closed": () => Promise<void>;
    "enter-full-screen": () => Promise<void>;
    "enter-html-full-screen": () => Promise<void>;
    "focus": () => Promise<void>;
    "hide": () => Promise<void>;
    "leave-full-screen": () => Promise<void>;
    "leave-html-full-screen": () => Promise<void>;
    "maximize": () => Promise<void>;
    "minimize": () => Promise<void>;
    "move": () => Promise<void>;
    "moved": () => Promise<void>;
    "new-window-for-tab": () => Promise<void>;
    "page-title-updated": (Event: Event, Title: string, ExplicitSet: boolean) => Promise<void>;
    "ready-to-show": () => Promise<void>;
    "resize": () => Promise<void>;
    "resized": () => Promise<void>;
    "responsive": () => Promise<void>;
    "restore": () => Promise<void>;
    "rotate-gesture": (Event: Event, Rotation: number) => Promise<void>;
    "session-end": (Event: Event) => Promise<void>;
    "sheet-begin": () => Promise<void>;
    "sheet-end": () => Promise<void>;
    "show": (Event: Event, IsAlwaysOnTop: boolean) => Promise<void>;
    "swipe": (Event: Event, Direction: string) => Promise<void>;
    "system-context-menu": (Event: Event, Point: Point) => Promise<void>;
    "unmaximize": () => Promise<void>;
    "unresponsive": () => Promise<void>;
    "will-move": (Event: Event, NewBounds: Rectangle) => Promise<void>;
    "will-resize": (Event: Event, NewBounds: Rectangle, Details: unknown) => Promise<void>;
}>;
