/* File:      General.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import { type ReactElement, type ReactNode, useState } from "react";
import { BooleanSettingControl } from "../../Component/BooleanSettingControl";
import { DropdownSettingControl } from "../../Component/DropdownSettingControl";
import { NumberSettingControl } from "../../Component/NumberSettingControl";
import { SettingSegment } from "../../Component/SettingSegment";
import { SettingSegmentContainer } from "../../Component/SettingSegmentContainer";
import { SettingsRegular } from "@fluentui/react-icons";
import { SettingsScreen } from "../SettingsScreen";
import { VersionUpdates } from "./VersionUpdates";

export const General = (): ReactElement =>
{
    const TestControl = (): ReactNode =>
    {
        const [ Value, SetValue ] = useState<boolean>(false);
        const OnChangeValue = (State: boolean) =>
        {
            SetValue(State);
        };

        return (
            <BooleanSettingControl { ...{ OnChangeValue, Value } } />
        );
    };

    const TestSelectControl = (): ReactNode =>
    {
        const [ Value, SetValue ] = useState<string>("One");
        const OnChangeValue = (SelectedOption: string) =>
        {
            SetValue(SelectedOption);
        };
        return (
            <DropdownSettingControl
                OnChangeValue={ OnChangeValue }
                Options={ [ "One", "Two", "Three" ] }
                Value={ Value }
            />
        );
    };

    const TestNumberControl = (): ReactNode =>
    {
        const [ Value, SetValue ] = useState<number>(2);
        const OnChangeValue = (NewValue: number): void =>
        {
            SetValue(NewValue);
        };
        return (
            <NumberSettingControl
                OnChangeValue={ OnChangeValue }
                Value={ Value }
            />
        );
    };

    return (
        <SettingsScreen Title="General">
            <VersionUpdates />
            <SettingSegmentContainer Title="Startup Behavior">
                <SettingSegment
                    Control={ <TestSelectControl /> }
                    Icon={ SettingsRegular }
                    Subtitle="This is the subtitle."
                    Title="Title"
                />
                <SettingSegment
                    Control={ <TestControl /> }
                    Icon={ SettingsRegular }
                    Subtitle="This is the subtitle."
                    Title="Title"
                />
                <SettingSegment
                    Control={ <TestNumberControl /> }
                    Subtitle="This is the subtitle."
                    Title="Title"
                />
                <SettingSegment
                    Control={ <TestControl /> }
                    Subtitle="This is the subtitle."
                    Title="Title"
                />
                <SettingSegment
                    Control={ <TestControl /> }
                    Icon={ SettingsRegular }
                    Subtitle="This is the subtitle."
                    Title="Title"
                />
            </SettingSegmentContainer>
        </SettingsScreen>
    );
};
