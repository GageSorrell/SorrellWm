/**
 * Constants for creating key components.
 *
 * @module @sorrell/keyboard-ui/Key
 *
 * @file      Key.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { KeyboardShiftUppercaseRegular } from "@fluentui/react-icons";
import type { ReactNode } from "react";

// @TODO Add more keys, like the media and web control keys.

const WindowsLogo = "\uE782" as const;

export/**
       * The Windows key.
       *
       * @category Key
       * @since 1.0.0
       */
const Super = (): ReactNode =>
    <span
        aria-hidden
        style={ {
            fontFamily: "\"Segoe Fluent Icons\", \"Segoe MDL2 Assets\""
        } }>
        { WindowsLogo }
    </span>;

export/**
       * The Windows key.
       *
       * @category Key
       * @since 1.0.0
       */
const Shift = KeyboardShiftUppercaseRegular;
