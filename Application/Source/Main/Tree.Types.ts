/* File:      Tree.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import type { FBox, HMonitor, HWindow } from "@sorrellwm/windows";

export type FVertexBase =
{
    Size: FBox;
    ZOrder: number;
};

export type FCell =
    FVertexBase &
    {
        Handle: HWindow;
    };

export type FVertex =
    | FCell
    | FPanel;

export type FPanelBase =
    FVertexBase &
    {
        Children: Array<FVertex>;
        /** Should only be set when this is the root panel of a monitor. */
        MonitorId?: HMonitor;
        Type: string;
    };

export type FPanelHorizontal =
    FPanelBase &
    {
        Type: "Horizontal";
    };

export type FPanelVertical =
    FPanelBase &
    {
        Type: "Vertical";
    };

export type FPanelStack =
    FPanelBase &
    {
        Type: "Stack";
    };

export type FPanel =
    | FPanelHorizontal
    | FPanelVertical;
    // | FPanelStack;

export type FForest = Array<FPanel>;

export type FAnnotatedPanel =
    FPanel &
    {
        ApplicationNames: Array<string>;
        Monitor: string;
        IsRoot: boolean;
        Screenshot: string | undefined;
    };

export type FFocusChange =
    | "Next"
    | "Previous"
    | "Up"
    | "Down";
