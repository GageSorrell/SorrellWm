/* File:      Monitor.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

import { type FMonitorInfo, InitializeMonitors } from "@sorrellwm/windows";
import { Subscribe } from "./NodeIpc";

const Monitors: Array<FMonitorInfo> = [ ];

export const GetMonitors = (): Array<FMonitorInfo> =>
{
    return [ ...Monitors ];
};

const OnMonitorsChanged = (..._Data: Array<unknown>): void =>
{
    // @TODO
};

const InitializeMonitorTracking = (): void =>
{
    Monitors.push(...InitializeMonitors());
    Subscribe("Monitors", OnMonitorsChanged);
};

InitializeMonitorTracking();
