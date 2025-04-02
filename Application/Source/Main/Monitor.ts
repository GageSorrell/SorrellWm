/* File:      Monitor.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { type FMonitorInfo, InitializeMonitors } from "@sorrellwm/windows";
import { Subscribe } from "./NodeIpc";
import { TDispatcher, type TSubscriptionHandle } from "./Dispatcher";

const Monitors: Array<FMonitorInfo> = [ ];

export const GetMonitors = (): Array<FMonitorInfo> =>
{
    return [ ...Monitors ];
};

const MonitorsDispatcher: TDispatcher<Array<FMonitorInfo>> = new TDispatcher<Array<FMonitorInfo>>();
export const MonitorsHandle: TSubscriptionHandle<Array<FMonitorInfo>> = MonitorsDispatcher.GetHandle();

const OnMonitorsChanged = (...Data: Array<unknown>): void =>
{
    const NewMonitors: Array<FMonitorInfo> = Data[0] as Array<FMonitorInfo>;
    Monitors.length = 0;
    Monitors.push(...NewMonitors);
    MonitorsDispatcher.Dispatch(NewMonitors);
};

const InitializeMonitorTracking = (): void =>
{
    Monitors.push(...InitializeMonitors());
    Subscribe("Monitors", OnMonitorsChanged);
};

InitializeMonitorTracking();
