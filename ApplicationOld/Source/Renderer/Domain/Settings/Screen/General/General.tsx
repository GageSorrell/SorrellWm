/**
 * @file      General.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2025 Gage Sorrell
 * @license   MIT
 */

import { type ReactElement, type ReactNode } from "react";
import { UseSendIpcEvent, UseSendIpcEventDeferredCallback } from "@/Temp";
import { BooleanSettingControl } from "../../Component/BooleanSettingControl";
import type { FLogger } from "../../../../../Shared/Log.Types";
import type { FSimpleCallback } from "../../../../../Shared";
import { GetLogger } from "@/Log";
import { SettingSegment } from "../../Component/SettingSegment";
import { SettingSegmentContainer } from "../../Component/SettingSegmentContainer";
import { SettingsScreen } from "../SettingsScreen";
// import type { TPath } from "Source/Shared/Utility/Object.Types";
import { TimerRegular } from "@fluentui/react-icons";
import { UseSettingState } from "@/Settings";
import { VersionUpdates } from "./VersionUpdates";

const Log: FLogger = GetLogger("General");

export const General = (): ReactElement =>
{
    const { Data, IsPending } = UseSendIpcEvent("GetIsElevated", undefined);

    const LaunchOnStartupSetting = (): ReactNode =>
    {
        const [ Value, OnChangeValue ] = UseSettingState("RunOnStartup");

        Log(`IsElevated: ${ Data?.IsElevated }; IsPending: ${ IsPending }.`);

        const [ SendIpcEvent ] = UseSendIpcEventDeferredCallback();

        const Disabled: boolean = !IsPending && Data !== undefined && !Data.IsElevated;
        const DisabledMessage: string = "This setting requires Administrator privileges.";
        const DisabledAction: FSimpleCallback = SendIpcEvent("RequestRestart", undefined);
        const DisabledActionLabel: string = "Restart SorrellWM";

        return (
            <SettingSegment
                Control={ <BooleanSettingControl { ...{ Disabled, OnChangeValue, Value } } /> }
                { ...{ Disabled, DisabledAction, DisabledActionLabel, DisabledMessage } }
                Icon={ TimerRegular }
                Subtitle="Launch SorrellWM automatically when you sign in."
                Title="Run on Startup"
            />
        );
    };

    return (
        <SettingsScreen Title="General">
            <VersionUpdates />
            <SettingSegmentContainer Title="Startup Behavior">
                <LaunchOnStartupSetting />
            </SettingSegmentContainer>
        </SettingsScreen>
    );
};
