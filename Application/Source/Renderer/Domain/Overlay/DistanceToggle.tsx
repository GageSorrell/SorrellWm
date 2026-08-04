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
import { GetShortcutParts } from "../../Component/CommandButton.js";
import { Keybind } from "@sorrell/keyboard-ui";
import type { OverlayDistanceToggleDto } from "../../../Shared/OverlayCommand.js";
import { RulerRegular } from "@fluentui/react-icons";

/** {@inheritDoc DistanceToggle} */
export interface DistanceToggleProps extends OverlayDistanceToggleDto { }

const UseStyles = makeStyles({
    Icon:
    {
        color: tokens.colorNeutralForeground3,
        fontSize: "1rem"
    },
    KeybindPlaceholder:
    {
        display: "inline-flex",
        visibility: "hidden"
    },
    Label:
    {
        color: tokens.colorNeutralForeground2,
        fontSize: tokens.fontSizeBase200,
        fontWeight: 600
    },
    Pair:
    {
        alignItems: "center",
        display: "inline-flex",
        gap: "0.3rem"
    },
    Root:
    {
        alignItems: "center",
        display: "inline-flex",
        gap: tokens.spacingHorizontalS,
        userSelect: "none"
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
        alignItems: "center",
        display: "inline-flex",
        gap: "1rem"
    }
});

export/** Render the Move screen's live "which distance is active" indicator. */
const DistanceToggle = (Props: DistanceToggleProps): React.JSX.Element =>
{
    const Styles = UseStyles();

    /* Alt (fine step) takes precedence over Shift (secondary distance) *
     * when both are held.                                              */
    const IsPrimaryActive = !Props.FineActive && !Props.Active;
    const IsSecondaryActive = !Props.FineActive && Props.Active;
    const IsFineActive = Props.FineActive;

    return (
        <div
            aria-label="Move distance"
            className={ Styles.Root }>
            <RulerRegular className={ Styles.Icon } />
            <span className={ Styles.Label }>
                Step Size
            </span>
            <span className={ Styles.Values }>
                <span className={ Styles.Pair }>
                    { /* The default step has no modifier of its own, but still reserves    *
                       * the same width a keybind would take up, so all three values align. */ }
                    <span className={ Styles.KeybindPlaceholder }>
                        <Keybind Keys={ GetShortcutParts(Props.Shortcut) } />
                    </span>
                    <span
                        aria-pressed={ IsPrimaryActive }
                        className={ mergeClasses(
                            Styles.Value,
                            IsPrimaryActive && Styles.ValueActive
                        ) }>
                        { Props.PrimaryDistance }
                    </span>
                </span>

                <span className={ Styles.Pair }>
                    <Keybind Keys={ GetShortcutParts(Props.Shortcut) } />
                    <span
                        aria-pressed={ IsSecondaryActive }
                        className={ mergeClasses(
                            Styles.Value,
                            IsSecondaryActive && Styles.ValueActive
                        ) }>
                        { Props.SecondaryDistance }
                    </span>
                </span>

                <span className={ Styles.Pair }>
                    <Keybind Keys={ GetShortcutParts(Props.FineShortcut) } />
                    <span
                        aria-pressed={ IsFineActive }
                        className={ mergeClasses(
                            Styles.Value,
                            IsFineActive && Styles.ValueActive
                        ) }>
                        { Props.FineDistance }
                    </span>
                </span>
            </span>
        </div>
    );
};
