/**
 * Ink UI component for theme overlay.
 *
 * @module @sorrell/ink-ui/Overlay/ThemeOverlay
 *
 * @file      ThemeOverlay.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import * as React from "react";
import { type PickerItem, PickerOverlay } from "./PickerOverlay.tsx";
import { type Theme, Themes } from "../Theme.tsx";

/** {@inheritDoc ThemePickerOverlay} */
export interface ThemePickerOverlayProps
{
    readonly OnCancel?: Thunk | undefined;
    readonly OnSelect: (Theme: Theme) => void;
    readonly Values?: ReadonlyArray<Theme>;
}

export/**
       * Provides a searchable picker for the built-in and supplied themes.
       *
       * @category Theme
       * @since 1.0.0
       */
const ThemePickerOverlay = ({
    OnCancel,
    OnSelect,
    Values = Themes
}: ThemePickerOverlayProps): React.ReactNode => (
    <PickerOverlay
        Items={ Values.map((Value: Theme) => ({
            Description: Value.Primary,
            Label: Value.Name,
            Value
        })) }
        OnCancel={ OnCancel }
        OnSelect={ (Item: PickerItem<Theme>) => OnSelect(Item.Value) }
        Title="Choose a theme" />
);
