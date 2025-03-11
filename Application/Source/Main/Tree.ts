/* File:      Tree.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

import type { FForest, FPanel, FPanelHorizontal } from "./Tree.Types";
import { type FMonitorInfo } from "@sorrellwm/windows";
import { GetMonitors } from "./Monitor";

const Forest: Array<FPanel> = [ ];

export const GetForest = (): FForest =>
{
    return [ ...Forest ];
};

export const UpdateForest = (UpdateFunction: (OldForest: FForest) => void): void =>
{
    UpdateFunction(Forest);
    // @TODO Move and resize, and sort ZOrder of all windows being tiled by SorrellWm.
};

const InitializeTree = (): void =>
{
    const Monitors: Array<FMonitorInfo> = GetMonitors();
    Forest.push(...Monitors.map((Monitor: FMonitorInfo): FPanelHorizontal =>
    {
        return {
            Children: [ ],
            Size: Monitor.Size,
            Type: "Horizontal",
            ZOrder: 0
        };
    }));
};

InitializeTree();
