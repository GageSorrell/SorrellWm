/* File:      DropdownSettingControl.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import { Dropdown, Option, type OptionOnSelectData, type SelectionEvents } from "@fluentui/react-components";
import { ChevronDownRegular } from "@fluentui/react-icons";
import type { PDropdownSettingControl } from "./DropdownSettingControl.Types";
import type { ReactNode } from "react";

export const DropdownSettingControl = (
    { OnChangeValue, Options, Value }: PDropdownSettingControl
): ReactNode =>
{
    const OnChange = (_Event: SelectionEvents, Data: OptionOnSelectData): void =>
    {
        if (Data.optionValue !== undefined)
        {
            OnChangeValue(Data.optionValue);
        }
    };

    return (
        <Dropdown
            appearance="outline"
            expandIcon={ <ChevronDownRegular style={ { fontSize: "0.9rem" } }/> }
            onOptionSelect={ OnChange }
            value={ Value }>
            {
                Options.map((OptionValue: string): ReactNode =>
                {
                    return (
                        <Option
                            key={ OptionValue }
                            value={ OptionValue }>
                            { OptionValue }
                        </Option>
                    );
                })
            }
        </Dropdown>
    );
};
