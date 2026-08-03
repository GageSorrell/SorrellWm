/**
 * A green "success" banner, e.g. for reporting that an update is ready or that an
 * application is up to date.  Also supports a yellow "warning" intent and an
 * indeterminate "checking" state.
 *
 * @module @sorrell/settings-ui/VersionMessageBar
 *
 * @file      VersionMessageBar.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { MessageBarIntent } from "@fluentui/react-components";
import {
    Button,
    Link,
    MessageBar,
    MessageBarActions,
    MessageBarBody,
    MessageBarTitle,
    makeStyles,
    tokens
} from "@fluentui/react-components";
import type { ReactNode } from "react";

/** A trailing link shown at the end of a {@link VersionMessageBar}'s first line. */
export interface VersionMessageBarLink
{
    readonly Href?: string;
    readonly Label: ReactNode;
    readonly OnClick?: () => void;
}

/** A button shown on its own row beneath a {@link VersionMessageBar}'s text. */
export interface VersionMessageBarAction
{
    readonly Label: ReactNode;
    readonly OnClick: () => void;
}

/** The color/icon treatment of a {@link VersionMessageBar}. */
export type VersionMessageBarIntent = "Success" | "Warn";

/** {@inheritDoc VersionMessageBar} */
export interface VersionMessageBarProps
{
    /** A button placed on its own row, e.g. "Install now". Providing one switches to a multiline layout. */
    readonly Action?: VersionMessageBarAction;

    /** The regular-weight body text following an optional {@link Title}, e.g. "v0.100.2". */
    readonly children?: ReactNode;

    /** Disable the {@link Action} button regardless of {@link Indeterminate}. */
    readonly Disabled?: boolean;

    /** Show a neutral, white "checking" state in place of the normal content and disable {@link Action}. */
    readonly Indeterminate?: boolean;

    /** The text shown while {@link Indeterminate}. Defaults to "Checking...". */
    readonly IndeterminateTitle?: string;

    /** The color/icon treatment of the bar. Defaults to `"Success"`. */
    readonly Intent?: VersionMessageBarIntent;

    /** A trailing link at the end of the first line, e.g. "See what's new". */
    readonly Link?: VersionMessageBarLink;

    /** A bold lead-in, e.g. "An update is ready to install:". */
    readonly Title?: ReactNode;
}

const DefaultIndeterminateTitle = "Checking..." as const;

const IntentToMessageBarIntent: Readonly<Record<VersionMessageBarIntent, MessageBarIntent>> = {
    Success: "success",
    Warn: "warning"
};

const UseStyles = makeStyles({
    Indeterminate:
    {
        backgroundColor: tokens.colorNeutralBackgroundStatic
    }
});

export/** A "success"/"warning" state banner, e.g. "SorrellWm is up to date". */
const VersionMessageBar = (
    {
        Action,
        children,
        Disabled,
        Indeterminate,
        IndeterminateTitle,
        Intent = "Success",
        Link: LinkProp,
        Title
    }: VersionMessageBarProps
): React.JSX.Element =>
{
    const Styles = UseStyles();
    const HasActions = LinkProp !== undefined || Action !== undefined;
    const IsIndeterminate = Indeterminate === true;
    const IsActionDisabled = IsIndeterminate || Disabled === true;

    return (
        <MessageBar
            className={ IsIndeterminate ? Styles.Indeterminate : undefined }
            intent={ IntentToMessageBarIntent[Intent] }
            layout={ Action === undefined ? "singleline" : "multiline" }>
            <MessageBarBody>
                { IsIndeterminate ? (
                    <MessageBarTitle>
                        { IndeterminateTitle ?? DefaultIndeterminateTitle }
                    </MessageBarTitle>
                ) : (
                    <>
                        { Title !== undefined && <MessageBarTitle>{ Title }</MessageBarTitle> }
                        { children }
                    </>
                ) }
            </MessageBarBody>

            { HasActions && (
                <MessageBarActions>
                    { LinkProp !== undefined && (
                        <Link
                            { ...(LinkProp.Href === undefined ? { } : { href: LinkProp.Href }) }
                            { ...(LinkProp.OnClick === undefined ? { } : { onClick: LinkProp.OnClick }) }>
                            { LinkProp.Label }
                        </Link>
                    ) }

                    { Action !== undefined && (
                        <Button appearance="secondary"
                            disabled={ IsActionDisabled }
                            onClick={ Action.OnClick }>
                            { Action.Label }
                        </Button>
                    ) }
                </MessageBarActions>
            ) }
        </MessageBar>
    );
};
