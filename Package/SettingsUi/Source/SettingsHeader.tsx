/**
 * A settings page's header: a title, followed by a preview image and
 * description shown side by side, with an optional trailing "Learn more" link.
 *
 * @module @sorrell/settings-ui/SettingsHeader
 *
 * @file      SettingsHeader.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Link, Title2, makeStyles, tokens } from "@fluentui/react-components";
import type { ReactNode } from "react";

const UseStyles = makeStyles({
    Description:
    {
        color: tokens.colorNeutralForeground2,
        margin: 0
    },
    Image:
    {
        border: `${ tokens.strokeWidthThin } solid ${ tokens.colorNeutralStroke2 }`,
        borderRadius: tokens.borderRadiusLarge,
        display: "block",
        flexShrink: 0,
        objectFit: "cover",
        width: "12rem"
    },
    Preview:
    {
        alignItems: "flex-start",
        display: "flex",
        gap: tokens.spacingHorizontalL
    },
    Root:
    {
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacingVerticalM
    },
    TextGroup:
    {
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacingVerticalS,
        minWidth: 0
    }
});

/** {@inheritDoc SettingsHeader} */
export interface SettingsHeaderProps
{
    /** The regular-weight text shown beside the image, e.g. what the feature does. */
    readonly Description: ReactNode;

    /** The alt text of the preview image. Defaults to `""` (the image is treated as decorative). */
    readonly ImageAlt?: string;

    /** The preview image shown beneath the title, e.g. a screenshot or animated preview. */
    readonly ImageSrc: string;

    /** The href of a trailing link placed after the description, e.g. "Learn more about Color Picker". */
    readonly LearnMoreHref?: string;

    /** The label of the trailing link. Defaults to `"Learn more"`. Ignored without {@link LearnMoreHref}. */
    readonly LearnMoreLabel?: ReactNode;

    /** The page's title, e.g. "Color Picker". */
    readonly Title: ReactNode;
}

export/** A settings page's header: a title, then a preview image and description side by side. */
const SettingsHeader = (
    {
        Description,
        ImageAlt = "",
        ImageSrc,
        LearnMoreHref,
        LearnMoreLabel = "Learn more",
        Title
    }: SettingsHeaderProps
): React.JSX.Element =>
{
    const Styles = UseStyles();

    return (
        <div className={ Styles.Root }>
            <Title2>{ Title }</Title2>

            <div className={ Styles.Preview }>
                <img
                    alt={ ImageAlt }
                    className={ Styles.Image }
                    src={ ImageSrc } />

                <div className={ Styles.TextGroup }>
                    <p className={ Styles.Description }>{ Description }</p>

                    { LearnMoreHref !== undefined && (
                        <Link href={ LearnMoreHref }>{ LearnMoreLabel }</Link>
                    ) }
                </div>
            </div>
        </div>
    );
};
