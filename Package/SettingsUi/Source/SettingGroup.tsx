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
import { PulseMotion } from "./Internal/PulseMotion.js";
import { UseSettingControlRegistration } from "./Internal/UseSettingControlRegistration.js";

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
        fontSize: tokens.fontSizeBase200,
        margin: 0
    },
    Title:
    {
        alignItems: "center",
        color: tokens.colorNeutralForeground1,
        display: "flex",
        fontSize: tokens.fontSizeBase400,
        fontWeight: tokens.fontWeightSemibold,
        gap: tokens.spacingHorizontalS,
        margin: 0
    }
});

/** {@inheritDoc SettingGroup} */
export interface SettingGroupProps
{
    /** {@link Setting} rows shown under this category, spaced with a small gap. */
    readonly children: ReactNode;

    /**
     * An identifier making this group addressable through `UseSettingControls`, which can
     * scroll to it and pulse its background. Omit for groups that never need to be jumped to.
     */
    readonly Id?: string;

    readonly Subtitle?: ReactNode;
    readonly Title: ReactNode;
}

export/** A titled category of settings, e.g. "Find My Mouse". */
const SettingGroup = ({ children, Id, Subtitle, Title }: SettingGroupProps): React.JSX.Element =>
{
    const Styles = UseStyles();
    const { NodeRef, PulseHandleRef } =
        UseSettingControlRegistration<HTMLElement>({ Id, Subtitle, Title });

    return (
        <PulseMotion RestingColor="transparent"
            imperativeRef={ PulseHandleRef }>
            <section className={ Styles.Root }
                ref={ NodeRef }>
                <div className={ Styles.Header }>
                    <h2 className={ Styles.Title }>
                        { Title }
                    </h2>

                    { Subtitle !== undefined && (
                        <p className={ Styles.Subtitle }>{ Subtitle }</p>
                    ) }
                </div>

                <div className={ Styles.Settings }>
                    { children }
                </div>
            </section>
        </PulseMotion>
    );
};
