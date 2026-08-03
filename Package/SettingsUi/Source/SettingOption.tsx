/**
 * One row within an expanded {@link Setting}'s accordion body, *e.g.*, a checkbox or a
 * labelled control.
 *
 * @module @sorrell/settings-ui/SettingOption
 *
 * @file      SettingOption.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { makeStyles, tokens } from "@fluentui/react-components";
import type { ReactNode } from "react";

const UseStyles = makeStyles({
    Content:
    {
        alignItems: "center",
        display: "flex",
        flex: "1 1 auto",
        minWidth: 0
    },
    Control:
    {
        flexShrink: 0
    },
    Root:
    {
        alignItems: "center",
        boxSizing: "border-box",
        display: "flex",
        gap: tokens.spacingHorizontalM,
        justifyContent: "space-between",
        minHeight: "2.75rem",
        padding: `${ tokens.spacingVerticalM } ${ tokens.spacingHorizontalM }`,

        ":not(:first-child)":
        {
            borderTop: `${ tokens.strokeWidthThin } solid ${ tokens.colorNeutralStroke2 }`
        }
    }
});

/** {@inheritDoc SettingOption} */
export interface SettingOptionProps
{
    /** The row's main content, e.g. a checkbox with its label. */
    readonly Content: ReactNode;

    /** An optional control placed at the row's trailing edge, e.g. a spinner or color picker. */
    readonly Control?: ReactNode;
}

export/** One selectable or configurable row within a {@link Setting}'s accordion body. */
const SettingOption = ({ Content, Control }: SettingOptionProps): React.JSX.Element =>
{
    const Styles = UseStyles();

    return (
        <div className={ Styles.Root }>
            <div className={ Styles.Content }>
                { Content }
            </div>

            { Control !== undefined && (
                <div className={ Styles.Control }>
                    { Control }
                </div>
            ) }
        </div>
    );
};
