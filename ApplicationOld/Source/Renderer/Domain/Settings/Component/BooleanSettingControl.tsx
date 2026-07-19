/**
 * @file      BooleanSettingControl.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { CSSProperties, ChangeEvent, ReactNode } from "react";
import { Switch, type SwitchOnChangeData } from "@fluentui/react-components";
import { GetFlexStyle } from "@sorrell/react";
import type { PBooleanSettingControl } from "./BooleanSettingControl.Types";

export function BooleanSettingControl({
    Disabled,
    OnChangeValue,
    Value
}: PBooleanSettingControl): ReactNode
{
    const RootStyle: CSSProperties = GetFlexStyle("row", "flex-end", "center");

    const OnChange = (
        _Event: ChangeEvent<HTMLInputElement>,
        Data: SwitchOnChangeData
    ): void =>
    {
        OnChangeValue(Data.checked);
    };

    return (
        <div style={ RootStyle }>
            <Switch
                checked={ Value }
                disabled={ Disabled }
                label={ Value ? "On" : "Off" }
                labelPosition="before"
                onChange={ OnChange }
            />
        </div>
    );
}
