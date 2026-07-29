/**
 * The Settings window's General section.
 *
 * @module @sorrell/wm/Renderer/SettingsGeneral
 *
 * @file      SettingsGeneral.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Logging from "./Logging.js";
import {
    Dropdown,
    Option,
    type OptionOnSelectData,
    type SelectionEvents,
    SpinButton,
    type SpinButtonChangeEvent,
    type SpinButtonOnChangeData,
    Switch,
    makeStyles,
    tokens
} from "@fluentui/react-components";
import type {
    GeneralSettingsDto,
    GeneralSettingsPatch,
    TiledResizeBehavior
} from "../Shared/AppSettings.js";
import {
    IsTiledResizeBehavior,
    TiledResizeBehaviors
} from "../Shared/AppSettings.js";
import { Setting, SettingGroup } from "@sorrell/settings-ui";
import { useEffect, useState } from "react";
import { GridRegular } from "@fluentui/react-icons";

const TiledResizeBehaviorLabel: Readonly<Record<TiledResizeBehavior, string>> = {
    AdjacentOnly: "Adjacent Window Only",
    PreserveRatios: "Preserve Other Ratios"
};

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

export/** Render general window-manager behavior settings. */
const SettingsGeneral = (): React.JSX.Element =>
{
    const Styles = UseStyles();
    const [ Settings, SetSettings ] = useState<GeneralSettingsDto | null>(null);

    useEffect(() =>
    {
        let IsCancelled = false;

        window.sorrell.generalSettings.get()
            .then((Loaded: GeneralSettingsDto) =>
            {
                if (!IsCancelled)
                {
                    SetSettings(Loaded);
                }
            })
            .catch(Logging.ReportRejection(
                "Settings",
                "Could not load general settings."
            ));

        return (): void =>
        {
            IsCancelled = true;
        };
    }, [ ]);

    const Commit = (Patch: GeneralSettingsPatch): void =>
    {
        SetSettings((Current: GeneralSettingsDto | null) =>
            Current === null ? Current : { ...Current, ...Patch });
        window.sorrell.generalSettings.set(Patch)
            .then((Updated: GeneralSettingsDto) => SetSettings(Updated))
            .catch(Logging.ReportRejection(
                "Settings",
                "Could not update general settings."
            ));
    };

    if (Settings === null)
    {
        return <p className={ Styles.Loading }>Loading…</p>;
    }

    return (
        <>
            <SettingGroup
                Subtitle="Choose how SorrellWm initializes the desktop when it starts."
                Title="Startup">
                <Setting
                    Control={
                        <Switch
                            aria-label="Tile existing windows on startup"
                            checked={ Settings.TileExistingWindowsOnStartup }
                            onChange={ (
                                _Event: React.ChangeEvent<HTMLInputElement>,
                                Data: { readonly checked: boolean; }
                            ) => Commit({
                                TileExistingWindowsOnStartup: Data.checked
                            }) } />
                    }
                    Icon={ GridRegular }
                    Subtitle="Add every existing floating window to the root panel of its current monitor."
                    Title="Tile Existing Windows on Startup" />
            </SettingGroup>

            <SettingGroup
                Subtitle="Control spacing around and between tiled windows."
                Title="Tiling">
                <Setting
                    Control={
                        <SpinButton
                            aria-label="Tiled window gap"
                            className={ Styles.SpinButton }
                            min={ 0 }
                            onChange={ (
                                _Event: SpinButtonChangeEvent,
                                Data: SpinButtonOnChangeData
                            ) =>
                            {
                                const Value = Data.value ?? (
                                    Data.displayValue === undefined
                                        ? undefined
                                        : Number(Data.displayValue)
                                );

                                if (Value !== undefined && Number.isInteger(Value) && Value >= 0)
                                {
                                    Commit({ TiledWindowGap: Value });
                                }
                            } }
                            step={ 1 }
                            value={ Settings.TiledWindowGap } />
                    }
                    Icon={ GridRegular }
                    Subtitle="Pixels between adjacent tiled windows and between tiles and monitor edges."
                    Title="Tiled Window Gap" />

                <Setting
                    Control={
                        <Dropdown
                            aria-label="Initial tiled resize behavior"
                            onOptionSelect={ (
                                _Event: SelectionEvents,
                                Data: OptionOnSelectData
                            ) =>
                            {
                                if (IsTiledResizeBehavior(Data.optionValue))
                                {
                                    Commit({
                                        TiledResizeBehavior: Data.optionValue
                                    });
                                }
                            } }
                            selectedOptions={ [ Settings.TiledResizeBehavior ] }
                            value={
                                TiledResizeBehaviorLabel[
                                    Settings.TiledResizeBehavior
                                ]
                            }>
                            { TiledResizeBehaviors.map((
                                Behavior: TiledResizeBehavior
                            ) => (
                                <Option
                                    key={ Behavior }
                                    value={ Behavior }>
                                    { TiledResizeBehaviorLabel[Behavior] }
                                </Option>
                            )) }
                        </Dropdown>
                    }
                    Icon={ GridRegular }
                    Subtitle={
                        "Choose whether tiled resizing preserves every other ratio "
                        + "or transfers space only to the adjacent window."
                    }
                    Title="Initial Resize Behavior" />
            </SettingGroup>
        </>
    );
};
