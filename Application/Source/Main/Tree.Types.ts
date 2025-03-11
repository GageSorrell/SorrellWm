/* File:      Tree.Types.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

import type { FBox } from "Windows";

export type FVertex =
{
    Size: FBox;
    ZOrder: number;
};

export type FPanelBase =
    FVertex &
    {
        Children: Array<FPanelBase>;
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
    | FPanelVertical
    | FPanelStack;

export type FForest = Array<FPanelBase>;
