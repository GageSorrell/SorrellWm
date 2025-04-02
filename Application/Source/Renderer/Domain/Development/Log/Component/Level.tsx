/* File:      Level.tsx
 * Author:    Gage Sorrell <gage@sorrell.sh>
 * Copyright: (c) 2025 Gage Sorrell
 * License:   MIT
 */

import type { FHexColor, FLogLevel } from "Windows";
import type { PLevel } from "./Level.Types";
import { Predicate } from "./Predicate";
import type { ReactElement } from "react";
import { tokens } from "@fluentui/react-components";

export const Level = ({ LogLevel }: PLevel): ReactElement =>
{
    const Colors: Record<FLogLevel, string> =
    {
        Error: tokens.colorPaletteMarigoldBackground3,
        Normal: tokens.colorPaletteLightTealBackground2,
        Verbose: tokens.colorNeutralBackground3,
        Warn: tokens.colorStatusDangerBackground3
    };

    return (
        <Predicate
            Color={ Colors[LogLevel] as FHexColor }
            Text={ LogLevel }
        />
    );
};
