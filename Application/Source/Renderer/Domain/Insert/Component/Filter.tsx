/* File:      Filter.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import type { CSSProperties, ReactElement } from "react";
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
        <div style={ RootStyle }>
            <Input
                size="large"
                style={ { position: "relative" } }
            />
            <div>
                Press <Key KeyId="C"/> to type and filter.
            </div>
        </div>
    );
};
