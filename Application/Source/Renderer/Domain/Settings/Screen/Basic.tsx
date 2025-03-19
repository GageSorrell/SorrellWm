/* File:      Basic.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

import { Checkbox } from "@fluentui/react-components";
import type { ReactElement } from "react";

export const Basic = (): ReactElement =>
{
    return (
        <div style={ { height: "100%", width: "100%" } }>
            Basic Screen
            <div>
                Run on Startup
                <Checkbox/>
            </div>
        </div>
    );
};
