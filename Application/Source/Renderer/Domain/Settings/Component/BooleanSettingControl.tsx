/* File:      BooleanSettingControl.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import type { CSSProperties, ChangeEvent, ReactNode } from "react";
import { Switch, type SwitchOnChangeData } from "@fluentui/react-components";
import { GetFlexStyle } from "@/Utility";
import type { PBooleanSettingControl } from "./BooleanSettingControl.Types";

export const BooleanSettingControl = ({ Value, OnChangeValue }: PBooleanSettingControl): ReactNode =>
{
    const RootStyle: CSSProperties = GetFlexStyle("row", "flex-end", "center");

    const OnChange = (_Event: ChangeEvent<HTMLInputElement>, Data: SwitchOnChangeData): void =>
    {
        OnChangeValue(Data.checked);
    };

    return (
        <div style={ RootStyle }>
            <Switch
                checked={ Value }
                label={ Value ? "On" : "Off" }
                labelPosition="before"
                onChange={ OnChange }
            />
        </div>
    );
};
