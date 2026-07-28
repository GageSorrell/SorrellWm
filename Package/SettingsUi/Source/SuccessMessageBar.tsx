/**
 * A green "success" banner, e.g. for reporting that an update is ready or that an
 * application is up to date.
 *
 * @module @sorrell/settings-ui/SuccessMessageBar
 *
 * @file      SuccessMessageBar.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import type { ReactNode } from "react";
import {
    Button,
    Link,
    MessageBar,
    MessageBarActions,
    MessageBarBody,
    MessageBarTitle
} from "@fluentui/react-components";

/** A trailing link shown at the end of a {@link SuccessMessageBar}'s first line. */
export interface SuccessMessageBarLink
{
    readonly Href?: string;
    readonly Label: ReactNode;
    readonly OnClick?: () => void;
}

/** A button shown on its own row beneath a {@link SuccessMessageBar}'s text. */
export interface SuccessMessageBarAction
{
    readonly Label: ReactNode;
    readonly OnClick: () => void;
}

/** Props for {@link SuccessMessageBar}. */
export interface SuccessMessageBarProps
{
    /** A button placed on its own row, e.g. "Install now". Providing one switches to a multiline layout. */
    readonly Action?: SuccessMessageBarAction;

    /** The regular-weight body text following an optional {@link Title}, e.g. "v0.100.2". */
    readonly children?: ReactNode;

    /** A trailing link at the end of the first line, e.g. "See what's new". */
    readonly Link?: SuccessMessageBarLink;

    /** A bold lead-in, e.g. "An update is ready to install:". */
    readonly Title?: ReactNode;
}

export/** A green "success" state banner, e.g. "PowerToys is up to date". */
const SuccessMessageBar = (
    { Action, children, Link: LinkProp, Title }: SuccessMessageBarProps
): React.JSX.Element =>
{
    const HasActions = LinkProp !== undefined || Action !== undefined;

    return (
        <MessageBar intent="success"
            layout={ Action === undefined ? "singleline" : "multiline" }>
            <MessageBarBody>
                { Title !== undefined && <MessageBarTitle>{ Title }</MessageBarTitle> }
                { children }
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
                            onClick={ Action.OnClick }>
                            { Action.Label }
                        </Button>
                    ) }
                </MessageBarActions>
            ) }
        </MessageBar>
    );
};
