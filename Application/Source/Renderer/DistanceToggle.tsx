/**
 * A live indicator of the Move screen's currently active move distance.
 *
 * @module @sorrell/wm/Renderer/DistanceToggle
 *
 * @file      DistanceToggle.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { makeStyles, mergeClasses, tokens } from "@fluentui/react-components";
import { GetShortcutParts } from "./CommandButton.js";
import { Keybind } from "@sorrell/keyboard-ui";
import type { OverlayDistanceToggleDto } from "../Shared/OverlayCommand.js";

/** Presentation properties for the Move screen's distance toggle. */
export interface DistanceToggleProps extends OverlayDistanceToggleDto { }

const UseStyles = makeStyles({
    Label:
    {
        color: tokens.colorNeutralForeground2,
        fontSize: tokens.fontSizeBase200,
        fontWeight: 600
    },
    Root:
    {
        alignItems: "center",
        display: "inline-flex",
        gap: tokens.spacingHorizontalS
    },
    Shortcut:
    {
        alignItems: "center",
        color: tokens.colorNeutralForeground3,
        display: "inline-flex",
        fontSize: tokens.fontSizeBase200,
        gap: "0.2rem"
    },
    Value:
    {
        border: `1px solid ${ tokens.colorNeutralStroke2 }`,
        borderRadius: tokens.borderRadiusMedium,
        color: tokens.colorNeutralForeground2,
        fontSize: tokens.fontSizeBase200,
        fontWeight: 600,
        padding: "0.2rem 0.55rem"
    },
    ValueActive:
    {
        backgroundColor: tokens.colorBrandBackground,
        border: `1px solid ${ tokens.colorBrandBackground }`,
        color: tokens.colorNeutralForegroundOnBrand
    },
    Values:
    {
        display: "inline-flex",
        gap: "0.35rem"
    }
});

export/** Render the Move screen's live "which distance is active" indicator. */
const DistanceToggle = (Props: DistanceToggleProps): React.JSX.Element =>
{
    const Styles = UseStyles();

    return (
        <div
            aria-label="Move distance"
            className={ Styles.Root }>
            <span className={ Styles.Label }>Toggle Distance</span>
            <span className={ Styles.Values }>
                <span
                    aria-pressed={ !Props.Active }
                    className={ mergeClasses(
                        Styles.Value,
                        !Props.Active && Styles.ValueActive
                    ) }>
                    { Props.PrimaryDistance }
                </span>
                <span
                    aria-pressed={ Props.Active }
                    className={ mergeClasses(
                        Styles.Value,
                        Props.Active && Styles.ValueActive
                    ) }>
                    { Props.SecondaryDistance }
                </span>
            </span>
            <span className={ Styles.Shortcut }>
                <Keybind Keys={ GetShortcutParts(Props.Shortcut) } />
            </span>
        </div>
    );
};
