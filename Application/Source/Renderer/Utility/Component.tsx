/* File:      Component.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2026 Gage Sorrell
 * License:   MIT
 */

import { Divider } from "@fluentui/react-components";
import type { ReactNode } from "react";

export const VerticalDivider = (): ReactNode =>
{
    return (
        <Divider
            style={ { maxWidth: 2, minHeight: "100%" } }
            vertical
        />
    );
};
