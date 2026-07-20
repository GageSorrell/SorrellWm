/**
 * @file      ThemeToggle.Internal.Types.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

/* eslint-disable jsdoc/require-jsdoc */

import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { LucideProps } from "lucide-react";

export type FIcon =
    ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> &
        RefAttributes<SVGSVGElement>
    >;

export type FClipPath = [ string, string ];
