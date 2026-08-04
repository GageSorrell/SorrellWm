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

import * as Logging from "../../Logging.js";
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
    ResizeRecoveryStrategy as ResizeRecoveryStrategyType,
    TiledResizeBehavior
} from "../../../Shared/AppSettings.js";
import {
    IsTiledResizeBehavior,
    ResizeRecoveryStrategy,
    TiledResizeBehaviors
} from "../../../Shared/AppSettings.js";
import { Setting, SettingGroup } from "@sorrell/settings-ui";
import { useEffect, useState } from "react";
import { GridRegular } from "@fluentui/react-icons";
import { MakeSettingControlId } from "./SettingControlId.js";
import { SettingsSectionId } from "../../../Shared/SettingsPath.js";
import { String } from "effect";

const TiledResizeBehaviorLabel: Readonly<Record<TiledResizeBehavior, string>> = {
    AdjacentOnly: "Adjacent Window Only",
    PreserveRatios: "Preserve Other Ratios"
};

type ResizeRecoveryStrategyTag = ResizeRecoveryStrategyType["_tag"];

const ResizeRecoveryStrategyLabel: Readonly<Record<ResizeRecoveryStrategyTag, string>> = {
    Cancel: "Cancel the Operation",
    Continue: "Continue with Actual Size",
    Ignore: "Ignore the Actual Size"
};

const MakeResizeRecoveryStrategy = (
    Tag: ResizeRecoveryStrategyTag,
    Threshold: number | undefined
): ResizeRecoveryStrategyType =>
{
    switch (Tag)
    {
        case "Cancel":
            return ResizeRecoveryStrategy.Cancel();
        case "Continue":
            return ResizeRecoveryStrategy.Continue({ Threshold });
        case "Ignore":
            return ResizeRecoveryStrategy.Ignore({ Threshold });
    }
};

const UseStyles = makeStyles({
    Loading:
    {
        color: tokens.colorNeutralForeground3
    },
    ResizeRecoveryControls:
    {
        alignItems: "flex-end",
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
        gap: tokens.spacingHorizontalS
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
                Id={ MakeSettingControlId(SettingsSectionId.General, "OverlayActivation") }
                Subtitle="Choose when the command overlay can be opened."
                Title="Overlay Activation">
                <Setting
                    Control={
                        <Switch
                            aria-label="Ignore activation keybind in fullscreen"
                            checked={ Settings.IgnoreActivationKeybindInFullscreen }
                            onChange={ (
                                _Event: React.ChangeEvent<HTMLInputElement>,
                                Data: { readonly checked: boolean; }
                            ) => Commit({
                                IgnoreActivationKeybindInFullscreen: Data.checked
                            }) } />
                    }
                    Icon={ GridRegular }
                    Id={ MakeSettingControlId(
                        SettingsSectionId.General,
                        "IgnoreActivationKeybindInFullscreen"
                    ) }
                    Subtitle={
                        "Prevent the overlay from opening over fullscreen games, "
                        + "videos, and other applications."
                    }
                    Title="Ignore Activation Keybind in Fullscreen" />
            </SettingGroup>

            <SettingGroup
                Id={ MakeSettingControlId(SettingsSectionId.General, "Startup") }
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
                    Id={ MakeSettingControlId(SettingsSectionId.General, "TileExistingWindowsOnStartup") }
                    Subtitle="Add every existing floating window to the root panel of its current monitor."
                    Title="Tile Existing Windows on Startup" />
            </SettingGroup>

            <SettingGroup
                Id={ MakeSettingControlId(SettingsSectionId.General, "Tiling") }
                Subtitle="Control spacing around and between tiled windows."
                Title="Tiling">
                <Setting
                    Control={
                        <div className={ Styles.ResizeRecoveryControls }>
                            <Dropdown
                                aria-label="Resize recovery strategy"
                                onOptionSelect={ (
                                    _Event: SelectionEvents,
                                    Data: OptionOnSelectData
                                ) =>
                                {
                                    const Tag = Data.optionValue;
                                    if (Tag === "Cancel" || Tag === "Continue" || Tag === "Ignore")
                                    {
                                        const Current = Settings.ResizeRecoveryStrategy;
                                        const Threshold = Current._tag === "Cancel"
                                            ? 128
                                            : Current.Threshold;
                                        Commit({
                                            ResizeRecoveryStrategy:
                                                MakeResizeRecoveryStrategy(Tag, Threshold)
                                        });
                                    }
                                } }
                                selectedOptions={ [ Settings.ResizeRecoveryStrategy._tag ] }
                                value={
                                    ResizeRecoveryStrategyLabel[
                                        Settings.ResizeRecoveryStrategy._tag
                                    ]
                                }>
                                { ([ "Cancel", "Continue", "Ignore" ] as const).map((
                                    Tag: ResizeRecoveryStrategyTag
                                ) => (
                                    <Option
                                        key={ Tag }
                                        value={ Tag }>
                                        { ResizeRecoveryStrategyLabel[Tag] }
                                    </Option>
                                )) }
                            </Dropdown>

                            { Settings.ResizeRecoveryStrategy._tag !== "Cancel" && (
                                <SpinButton
                                    aria-label="Resize recovery threshold"
                                    className={ Styles.SpinButton }
                                    displayValue={ `${ Settings.ResizeRecoveryStrategy.Threshold } px` }
                                    min={ 0 }
                                    onChange={ (
                                        _Event: SpinButtonChangeEvent,
                                        Data: SpinButtonOnChangeData
                                    ) =>
                                    {
                                        const DisplayValue = Data.displayValue?.trim();
                                        const Value = Data.value ?? (
                                            DisplayValue === undefined || DisplayValue.length === 0
                                                ? undefined
                                                : Number(String.slice(undefined, 3)(DisplayValue))
                                        );

                                        if (
                                            Value === undefined
                                            || (Number.isInteger(Value) && Value >= 0)
                                        )
                                        {
                                            Commit({
                                                ResizeRecoveryStrategy: MakeResizeRecoveryStrategy(
                                                    Settings.ResizeRecoveryStrategy._tag,
                                                    Value
                                                )
                                            });
                                        }
                                    } }
                                    placeholder="No minimum"
                                    step={ 1 }
                                    value={ Settings.ResizeRecoveryStrategy.Threshold ?? null } />
                            ) }
                        </div>
                    }
                    Icon={ GridRegular }
                    Id={ MakeSettingControlId(
                        SettingsSectionId.General,
                        "ResizeRecoveryStrategy"
                    ) }
                    Subtitle={
                        "Choose whether tiled Move, Resize, and Insert operations cancel, "
                        + "adapt, or ignore an application's enforced minimum window size."
                    }
                    Title="Resize Recovery Strategy"
                />
                <Setting
                    Control={
                        <SpinButton
                            aria-label="Tiled window gap"
                            className={ Styles.SpinButton }
                            displayValue={ `${ Settings.TiledWindowGap } px` }
                            min={ 0 }
                            onChange={ (
                                _Event: SpinButtonChangeEvent,
                                Data: SpinButtonOnChangeData
                            ) =>
                            {
                                const DisplayValue = Data.displayValue?.trim();
                                const Value = Data.value ?? (
                                    DisplayValue === undefined || DisplayValue.length === 0
                                        ? undefined
                                        : Number.parseInt(DisplayValue, 10)
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
                    Id={ MakeSettingControlId(SettingsSectionId.General, "TiledWindowGap") }
                    Subtitle="Pixels between adjacent tiled windows and between tiles and monitor edges."
                    Title="Tiled Window Gap"
                />
                <Setting
                    Control={
                        <SpinButton
                            aria-label="Tiled window detach distance"
                            className={ Styles.SpinButton }
                            displayValue={ `${ Settings.TiledWindowDetachDistance } px` }
                            min={ 0 }
                            onChange={ (
                                _Event: SpinButtonChangeEvent,
                                Data: SpinButtonOnChangeData
                            ) =>
                            {
                                const DisplayValue = Data.displayValue?.trim();
                                const Value = Data.value ?? (
                                    DisplayValue === undefined || DisplayValue.length === 0
                                        ? undefined
                                        : Number.parseInt(DisplayValue, 10)
                                );

                                if (Value !== undefined && Number.isInteger(Value) && Value >= 0)
                                {
                                    Commit({ TiledWindowDetachDistance: Value });
                                }
                            } }
                            step={ 1 }
                            value={ Settings.TiledWindowDetachDistance } />
                    }
                    Icon={ GridRegular }
                    Id={ MakeSettingControlId(SettingsSectionId.General, "TiledWindowDetachDistance") }
                    Subtitle={
                        "How far you must drag a tiled window before it detaches and floats, "
                        + "instead of snapping back to its tile. Scaled by display."
                    }
                    Title="Tiled Window Detach Distance" />

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
                                    Commit({ TiledResizeBehavior: Data.optionValue });
                                }
                            } }
                            selectedOptions={ [ Settings.TiledResizeBehavior ] }
                            value={ TiledResizeBehaviorLabel[Settings.TiledResizeBehavior] }>
                            { TiledResizeBehaviors.map((Behavior: TiledResizeBehavior) => (
                                <Option
                                    key={ Behavior }
                                    value={ Behavior }>
                                    { TiledResizeBehaviorLabel[Behavior] }
                                </Option>
                            )) }
                        </Dropdown>
                    }
                    Icon={ GridRegular }
                    Id={ MakeSettingControlId(SettingsSectionId.General, "InitialResizeBehavior") }
                    Subtitle={
                        "Choose whether tiled resizing preserves every other ratio "
                        + "or transfers space only to the adjacent window."
                    }
                    Title="Initial Resize Behavior"
                />
            </SettingGroup>
        </>
    );
};
