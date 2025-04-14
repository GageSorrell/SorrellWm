/* File:      Filter.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import type { CSSProperties, ReactElement } from "react";
import type { PHighlightedHalf } from "./HighlightedHalf.Types";
import { Pulse } from "@/Domain/Common/Component/Pulse";
import { UseThemeColors } from "@/Utility";
import { Input } from "@fluentui/react-components";
import { Key } from "@/Domain/Common";

export const Filter = (): ReactElement =>
{
    const RootStyle: CSSProperties =
    {
    };

    /* @TODO Should have a hint reminding the user that, if they have entered    *
     * input then this component loses focus, pressing square will return focus. */
    return (
        <div>
            <Input
                size="large"
                style={{ position: "relative" }}
            />
            <div>
                Press <Key Value="C"/> to type and filter.
            </div>
        </div>
    );
};
