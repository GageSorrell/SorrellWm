/**
 * @file      Tree.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */

import type { FBox, HMonitor, HWindow } from "@sorrell/wm-windows";

export type FVertexBase =
{
    /** @TODO Add `GapSize` or `GridSize` (if you add `GridSize`, make `Size` be the "GapSize"). */
    // GapSize: FBox;
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

export type FPanelDirection =
    | "Horizontal"
    | "Vertical"

export type FPanelType =
    | FPanelDirection
    | "Stack";

export type FPanelBase =
    FVertexBase &
    {
        Children: TArray<FVertex>;
        /** Should only be set when this is the root panel of a monitor. */
        MonitorId?: HMonitor;
        Type: FPanelType;
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

export type FForest = TArray<FPanel>;

export type FAnnotatedPanel =
    FPanel &
    {
        ApplicationNames: TArray<string>;
        MonitorName: string;
        IsRoot: boolean;
        Screenshot: string | undefined;
    };

export type FFocusChange =
    | "Next"
    | "Previous"
    | "Up"
    | "Down";

export type FLogTransformer = (Vertex: FVertex, Depth: number, DefaultString: string) => string;

export type FGapData =
{
    AdjustedSize: FBox;
    PrincipalRatio: number;
};
