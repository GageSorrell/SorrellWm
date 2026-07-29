/**
 * A settings row for a value that corresponds to an Effect `Option`: the
 * row's own control sits immediately left of a toggle switch, flush right,
 * that turns the setting on (`Some`) or off (`None`). Defaults to off.
 *
 * @module @sorrell/settings-ui/OptionalSetting
 *
 * @file      OptionalSetting.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ChangeEvent, ReactNode } from "react";
import { Setting, type SettingProps } from "./Setting.js";
import {
    type SwitchOnChangeData,
    makeStyles,
    mergeClasses,
    tokens
} from "@fluentui/react-components";
import { SettingToggle } from "./SettingToggle.js";

const UseStyles = makeStyles({
    Control:
    {
        display: "flex"
    },
    ControlDisabled:
    {
        opacity: 0.5,
        pointerEvents: "none"
    },
    Controls:
    {
        alignItems: "center",
        display: "flex",
        gap: tokens.spacingHorizontalM
    }
});

/** {@inheritDoc OptionalSetting} */
export interface OptionalSettingProps extends Pick<SettingProps, "Icon" | "Subtitle" | "Title">
{
    /** An accessible name for the switch, since its visible label only ever reads "On"/"Off". */
    readonly AriaLabel?: string;

    /** The setting's own control, e.g. a dropdown or input, shown immediately left of the switch. */
    readonly Control?: ReactNode;

    /**
     * Whether the setting is currently off (the `Option` is `None`). The switch
     * itself always stays interactive; only {@link Control} is dimmed and
     * disabled while this is `true`. Defaults to `true` (off).
     */
    readonly Disabled?: boolean;

    /** Called when the switch is toggled, with the new {@link Disabled} value. */
    readonly OnDisabledChange?: (Disabled: boolean) => void;
}

export/** A setting row for an optional value: its control, then an on/off switch. */
const OptionalSetting = (
    { AriaLabel, Control, Disabled = true, Icon, OnDisabledChange, Subtitle, Title }: OptionalSettingProps
): React.JSX.Element =>
{
    const Styles = UseStyles();

    return (
        <Setting
            Control={
                <div className={ Styles.Controls }>
                    { Control !== undefined && (
                        <div className={ mergeClasses(
                            Styles.Control,
                            Disabled && Styles.ControlDisabled
                        ) }>
                            { Control }
                        </div>
                    ) }

                    <SettingToggle
                        { ...(AriaLabel === undefined ? { } : { AriaLabel }) }
                        Checked={ !Disabled }
                        OnChange={ (
                            _Event: ChangeEvent<HTMLInputElement>,
                            Data: SwitchOnChangeData
                        ) => OnDisabledChange?.(!Data.checked) } />
                </div>
            }
            Icon={ Icon }
            Subtitle={ Subtitle }
            Title={ Title } />
    );
};
