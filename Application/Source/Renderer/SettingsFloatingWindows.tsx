/**
 * The Settings window's "Floating Windows" section: editable step sizes and
 * press-and-hold speeds for the Move overlay screen.
 *
 * @module @sorrell/wm/Renderer/SettingsFloatingWindows
 *
 * @file      SettingsFloatingWindows.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Logging from "./Logging.js";
import {
    ArrowMaximizeRegular,
    ArrowMoveRegular,
    TopSpeedRegular
} from "@fluentui/react-icons";
import { Setting, SettingGroup } from "@sorrell/settings-ui";
import {
    SpinButton,
    type SpinButtonChangeEvent,
    type SpinButtonOnChangeData,
    makeStyles,
    tokens
} from "@fluentui/react-components";
import { useEffect, useState } from "react";
import type { FloatingWindowSettingsDto } from "../Shared/AppSettings.js";
import { MakeSettingControlId } from "./SettingControlId.js";
import { SettingsSectionId } from "../Shared/SettingsPath.js";

const UseStyles = makeStyles({
    Loading:
    {
        color: tokens.colorNeutralForeground3
    },
    SpinButton:
    {
        width: "6rem"
    }
});

type NumericFieldId = keyof FloatingWindowSettingsDto;

interface NumericFieldProps
{
    readonly Min?: number;
    readonly OnCommit: (Value: number) => void;
    readonly Step?: number;
    readonly Value: number;
}

const NumericField = (
    { Min = 0, OnCommit, Step = 1, Value }: NumericFieldProps
): React.JSX.Element =>
{
    const Styles = UseStyles();

    return (
        <SpinButton
            className={ Styles.SpinButton }
            min={ Min }
            onChange={ (
                _Event: SpinButtonChangeEvent,
                Data: SpinButtonOnChangeData
            ) =>
            {
                const NextValue = Data.value ?? (
                    Data.displayValue === undefined ? undefined : Number(Data.displayValue)
                );

                if (NextValue !== undefined && Number.isFinite(NextValue))
                {
                    OnCommit(NextValue);
                }
            } }
            step={ Step }
            value={ Value } />
    );
};

export/** Render the "Floating Windows" settings section: Move-screen step sizes and speeds. */
const SettingsFloatingWindows = (): React.JSX.Element =>
{
    const Styles = UseStyles();
    const [ Settings, SetSettings ] = useState<FloatingWindowSettingsDto | null>(null);

    useEffect(() =>
    {
        let IsCancelled = false;

        window.sorrell.floatingWindowSettings.get()
            .then((Loaded: FloatingWindowSettingsDto) =>
            {
                if (!IsCancelled)
                {
                    SetSettings(Loaded);
                }
            })
            .catch(Logging.ReportRejection(
                "Settings",
                "Could not load floating-window settings."
            ));

        return (): void =>
        {
            IsCancelled = true;
        };
    }, [ ]);

    const Commit = (Key: NumericFieldId, Value: number): void =>
    {
        SetSettings((Current: FloatingWindowSettingsDto | null) =>
            (Current === null ? Current : { ...Current, [Key]: Value }));

        window.sorrell.floatingWindowSettings.set({ [Key]: Value })
            .then((Updated: FloatingWindowSettingsDto) => SetSettings(Updated))
            .catch(Logging.ReportRejection(
                "Settings",
                "Could not update floating-window settings."
            ));
    };

    if (Settings === null)
    {
        return <p className={ Styles.Loading }>Loading…</p>;
    }

    return (
        <SettingGroup
            Id={ MakeSettingControlId(SettingsSectionId.FloatingWindows, "MoveStepSizes") }
            Subtitle="Control how far, and how fast, a floating window moves on the Move overlay screen."
            Title="Move Step Sizes">
            <Setting
                Control={ <NumericField
                    Min={ 1 }
                    OnCommit={ (Value: number) => Commit("MoveStepPrimary", Value) }
                    Value={ Settings.MoveStepPrimary } /> }
                Icon={ ArrowMoveRegular }
                Id={ MakeSettingControlId(SettingsSectionId.FloatingWindows, "PrimaryStepSize") }
                Subtitle="Pixels moved per press of a direction key."
                Title="Primary Step Size" />

            <Setting
                Control={ <NumericField
                    Min={ 0.1 }
                    OnCommit={ (Value: number) => Commit("MoveStepPrimarySpeedFactor", Value) }
                    Step={ 0.1 }
                    Value={ Settings.MoveStepPrimarySpeedFactor } /> }
                Icon={ TopSpeedRegular }
                Id={ MakeSettingControlId(SettingsSectionId.FloatingWindows, "PrimaryHoldSpeed") }
                Subtitle="Press-and-hold speed, as a multiple of the primary step size per second."
                Title="Primary Hold Speed" />

            <Setting
                Control={ <NumericField
                    Min={ 1 }
                    OnCommit={ (Value: number) => Commit("MoveStepSecondary", Value) }
                    Value={ Settings.MoveStepSecondary } /> }
                Icon={ ArrowMaximizeRegular }
                Id={ MakeSettingControlId(SettingsSectionId.FloatingWindows, "SecondaryStepSize") }
                Subtitle="Pixels moved per press of a direction key while the distance modifier is held."
                Title="Secondary Step Size" />

            <Setting
                Control={ <NumericField
                    Min={ 0.1 }
                    OnCommit={ (Value: number) => Commit("MoveStepSecondarySpeedFactor", Value) }
                    Step={ 0.1 }
                    Value={ Settings.MoveStepSecondarySpeedFactor } /> }
                Icon={ TopSpeedRegular }
                Id={ MakeSettingControlId(SettingsSectionId.FloatingWindows, "SecondaryHoldSpeed") }
                Subtitle="Press-and-hold speed, as a multiple of the secondary step size per second."
                Title="Secondary Hold Speed" />

            <Setting
                Control={ <NumericField
                    Min={ 1 }
                    OnCommit={ (Value: number) => Commit("MoveFineSpeed", Value) }
                    Value={ Settings.MoveFineSpeed } /> }
                Icon={ TopSpeedRegular }
                Id={ MakeSettingControlId(SettingsSectionId.FloatingWindows, "FineStepHoldSpeed") }
                Subtitle="Fixed press-and-hold speed, in pixels/second, while the fine-step modifier is held."
                Title="Fine Step Hold Speed" />
        </SettingGroup>
    );
};
