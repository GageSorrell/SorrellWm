/**
 * A titled category grouping a small-gapped stack of {@link Setting} rows.
 *
 * @module @sorrell/settings-ui/SettingGroup
 *
 * @file      SettingGroup.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ReactNode } from "react";
import { makeStyles, tokens } from "@fluentui/react-components";

const UseStyles = makeStyles({
    Header:
    {
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacingVerticalXXS
    },
    Root:
    {
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacingVerticalL
    },
    Settings:
    {
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacingVerticalS
    },
    Subtitle:
    {
        color: tokens.colorNeutralForeground3,
        fontSize: tokens.fontSizeBase300,
        margin: 0
    },
    Title:
    {
        color: tokens.colorNeutralForeground1,
        fontSize: tokens.fontSizeBase400,
        fontWeight: tokens.fontWeightSemibold,
        margin: 0
    }
});

/** Props for {@link SettingGroup}. */
export interface SettingGroupProps
{
    /** {@link Setting} rows shown under this category, spaced with a small gap. */
    readonly children: ReactNode;

    readonly Subtitle?: ReactNode;
    readonly Title: ReactNode;
}

export/** A titled category of settings, e.g. "Find My Mouse". */
const SettingGroup = ({ children, Subtitle, Title }: SettingGroupProps): React.JSX.Element =>
{
    const Styles = UseStyles();

    return (
        <section className={ Styles.Root }>
            <div className={ Styles.Header }>
                <h2 className={ Styles.Title }>{ Title }</h2>

                { Subtitle !== undefined && (
                    <p className={ Styles.Subtitle }>{ Subtitle }</p>
                ) }
            </div>

            <div className={ Styles.Settings }>
                { children }
            </div>
        </section>
    );
};
