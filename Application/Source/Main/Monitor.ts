/**
 * @file      Monitor.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */

import { type FMonitorInfo, InitializeMonitors } from "@sorrell/wm-windows";
import { TDispatcher, type TSubscriptionHandle } from "#/Event/Dispatcher";
import { RegisterInitializationFunction } from "#/Initialize/Initialize";
import { Subscribe } from "#/Event/NodeIpc";

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

const TrackMonitors = async (): Promise<void> =>
{
    Monitors.push(...InitializeMonitors());
    Subscribe("Monitors", OnMonitorsChanged);
};

RegisterInitializationFunction("Monitor", TrackMonitors, [ "NodeIpc" ]);
