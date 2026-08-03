/**
 * A Fluent `Switch` prefixed with an "On"/"Off" label, for use as a {@link Setting}'s `Control`.
 *
 * @module @sorrell/settings-ui/SettingToggle
 *
 * @file      SettingToggle.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Switch, type SwitchOnChangeData, makeStyles, tokens } from "@fluentui/react-components";
import type { ChangeEvent } from "react";

const UseStyles = makeStyles({
    Label:
    {
        color: tokens.colorNeutralForeground3,
        fontSize: tokens.fontSizeBase300
    }
});

/** {@inheritDoc SettingToggle} */
export interface SettingToggleProps
{
    /** An accessible name for the switch, since its visible label only ever reads "On"/"Off". */
    readonly AriaLabel?: string;
    readonly Checked: boolean;
    readonly Disabled?: boolean;
    readonly OnChange?: (Event: ChangeEvent<HTMLInputElement>, Data: SwitchOnChangeData) => void;
}

export/** An "On"/"Off"-labelled toggle switch. */
const SettingToggle = (
    { AriaLabel, Checked, Disabled, OnChange }: SettingToggleProps
): React.JSX.Element =>
{
    const Styles = UseStyles();

    return (
        <Switch
            aria-label={ AriaLabel }
            checked={ Checked }
            disabled={ Disabled }
            label={ { children: Checked ? "On" : "Off", className: Styles.Label } }
            labelPosition="before"
            { ...(OnChange === undefined ? { } : { onChange: OnChange }) } />
    );
};
