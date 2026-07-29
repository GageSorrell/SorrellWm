/**
 * The Settings window's Overlay section.
 *
 * @module @sorrell/wm/Renderer/SettingsOverlay
 *
 * @file      SettingsOverlay.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as Logging from "./Logging.js";
import { Setting, SettingGroup } from "@sorrell/settings-ui";
import {
    Slider,
    type SliderOnChangeData,
    Switch,
    makeStyles,
    tokens
} from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { EyeRegular } from "@fluentui/react-icons";
import { MakeSettingControlId } from "./SettingControlId.js";
import type { OverlaySettingsDto } from "../Shared/AppSettings.js";
import { SettingsSectionId } from "../Shared/SettingsPath.js";

const UseStyles = makeStyles({
    Control:
    {
        alignItems: "center",
        display: "flex",
        gap: tokens.spacingHorizontalS,
        width: "13rem"
    },
    Loading:
    {
        color: tokens.colorNeutralForeground3
    },
    Slider:
    {
        flex: "1 1 auto"
    },
    Value:
    {
        minWidth: "3rem",
        textAlign: "right"
    }
});

export/** Render settings for the command overlay and directional Focus previews. */
const SettingsOverlay = (): React.JSX.Element =>
{
    const Styles = UseStyles();
    const [ Settings, SetSettings ] = useState<OverlaySettingsDto | null>(null);

    useEffect(() =>
    {
        let IsCancelled = false;

        window.sorrell.overlaySettings.get()
            .then((Loaded: OverlaySettingsDto) =>
            {
                if (!IsCancelled)
                {
                    SetSettings(Loaded);
                }
            })
            .catch(Logging.ReportRejection(
                "Settings",
                "Could not load overlay settings."
            ));

        return (): void =>
        {
            IsCancelled = true;
        };
    }, [ ]);

    const Commit = (Patch: Partial<OverlaySettingsDto>): void =>
    {
        SetSettings((Current: OverlaySettingsDto | null) =>
            Current === null ? Current : { ...Current, ...Patch });

        window.sorrell.overlaySettings.set(Patch)
            .then((Updated: OverlaySettingsDto) => SetSettings(Updated))
            .catch(Logging.ReportRejection(
                "Settings",
                "Could not update overlay settings."
            ));
    };

    if (Settings === null)
    {
        return <p className={ Styles.Loading }>Loading…</p>;
    }

    return (
        <>
            <SettingGroup
                Icon={ EyeRegular }
                Id={ MakeSettingControlId(SettingsSectionId.Overlay, "TitlebarFlyouts") }
                Subtitle="Control overlays opened from native window caption buttons."
                Title="Titlebar Flyouts">
                <Setting
                    Control={
                        <Switch
                            aria-label="Show stack picker on minimize hover"
                            checked={ Settings.ShowStackPanelMinimizeFlyout }
                            onChange={ (
                                _Event: React.ChangeEvent<HTMLInputElement>,
                                Data: { readonly checked: boolean; }
                            ) => Commit({
                                ShowStackPanelMinimizeFlyout: Data.checked
                            }) } />
                    }
                    Icon={ EyeRegular }
                    Id={ MakeSettingControlId(
                        SettingsSectionId.Overlay,
                        "ShowStackPanelMinimizeFlyout"
                    ) }
                    Subtitle={
                        "Show a window picker when the minimize button of a "
                        + "window in a stack panel is hovered."
                    }
                    Title="Stack Picker on Minimize Hover" />
            </SettingGroup>

            <SettingGroup
                Icon={ EyeRegular }
                Id={ MakeSettingControlId(SettingsSectionId.Overlay, "FocusPreviews") }
                Subtitle="Control how directional Focus targets are presented over obscured floating windows."
                Title="Focus Previews">
                <Setting
                    Control={
                        <div className={ Styles.Control }>
                            <Slider
                                aria-label="Focus preview opacity"
                                className={ Styles.Slider }
                                max={ 100 }
                                min={ 0 }
                                onChange={ (
                                    _Event: React.ChangeEvent<HTMLInputElement>,
                                    Data: SliderOnChangeData
                                ) => Commit({
                                    FocusPreviewOpacity: Math.round(Data.value)
                                }) }
                                // step={ 1 }
                                value={ Settings.FocusPreviewOpacity } />
                            <span className={ Styles.Value }>
                                { Settings.FocusPreviewOpacity }%
                            </span>
                        </div>
                    }
                    Icon={ EyeRegular }
                    Id={ MakeSettingControlId(SettingsSectionId.Overlay, "PreviewOpacity") }
                    Subtitle="Opacity of the sampled-color fill shown over a fully obscured floating window."
                    Title="Preview Opacity" />
            </SettingGroup>
        </>
    );
};
