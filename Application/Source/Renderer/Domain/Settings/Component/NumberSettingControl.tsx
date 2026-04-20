/**
 * @file      NumberSettingControl.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { CSSProperties, ReactNode } from "react";
import {
    SpinButton,
    type SpinButtonChangeEvent,
    type SpinButtonOnChangeData } from "@fluentui/react-components";
import type { PNumberSettingControl } from "./NumberSettingControl.Types";

export const NumberSettingControl = (
    { IsValueAllowed, MinValue, MaxValue = 10, OnChangeValue, Value }: PNumberSettingControl
): ReactNode =>
{
    const OnChange = (_Event: SpinButtonChangeEvent, Data: SpinButtonOnChangeData): void =>
    {
        if (Data.value === undefined || Data.value === null)
        {
            return;
        }

        if (IsValueAllowed !== undefined)
        {
            if (IsValueAllowed(Data.value))
            {
                OnChangeValue(Data.value);
            }
        }
        else
        {
            OnChangeValue(Data.value);
        }
    };

    const MaxNumDigits: number = MaxValue.toString().length;
    const RootStyle: CSSProperties =
    {
        width: 30 + (12 * MaxNumDigits)
    };

    return (
        <SpinButton
            max={ MaxValue }
            min={ MinValue }
            onChange={ OnChange }
            style={ RootStyle }
            value={ Value }
        />
    );
};
