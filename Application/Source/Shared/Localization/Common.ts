/**
 *
 *
 * @module @sorrell/wm/Localization/Common
 *
 * @file      Common.ts
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { PlainText } from "./Localization.ts";

export/**
       * Text that appears in the overlay window.
       *
       * @category L10n
       * @since 0.1.0
       */
const Common =
    {
        AppName: PlainText("SorrellWm")
    } as const;
