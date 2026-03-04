/* File:      Monitor.ts
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { type FMonitorInfo, InitializeMonitors } from "@sorrellwm/windows";
import { TDispatcher, type TSubscriptionHandle } from "./Core/Dispatcher";
import { Subscribe } from "./NodeIpc";

const Monitors: TArray<FMonitorInfo> = [ ];

export const GetMonitors = (): TArray<FMonitorInfo> =>
{
    return [ ...Monitors ];
};

const MonitorsDispatcher: TDispatcher<TArray<FMonitorInfo>> = new TDispatcher<TArray<FMonitorInfo>>();
export const MonitorsHandle: TSubscriptionHandle<TArray<FMonitorInfo>> = MonitorsDispatcher.GetHandle();

const OnMonitorsChanged = (...Data: TArray<unknown>): void =>
{
    const NewMonitors: TArray<FMonitorInfo> = Data[0] as TArray<FMonitorInfo>;
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
