/* File:      ActionBase.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Sorrell Intellectual Properties
 * License:   MIT
 */

import type { PAction } from "./Action.Types";
import type { ReactElement } from "react";

/** The base for most action pages. */
export const Action = ({ children }: PAction): ReactElement =>
{
    return (
        <div>
            { children }
        </div>
    );
};
