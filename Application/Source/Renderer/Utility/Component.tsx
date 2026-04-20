/**
 * @file      Component.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
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
