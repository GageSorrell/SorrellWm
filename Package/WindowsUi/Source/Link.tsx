/**
 * A hyperlink styled like a WinUI 3 `HyperlinkButton`: no underline, bold text, and a
 * rounded "shadow" background that appears on hover and darkens while pressed, rather
 * than Fluent UI's default underlined link styling.
 *
 * @module @sorrell/windows-ui/Link
 *
 * @file      Link.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import {
    Link as FluentLink,
    type LinkProps as FluentLinkProps,
    makeStyles,
    mergeClasses,
    tokens
} from "@fluentui/react-components";
import * as React from "react";

const UseStyles = makeStyles({
    Root:
    {
        borderRadius: tokens.borderRadiusMedium,
        fontWeight: tokens.fontWeightBold,
        margin: `calc(${ tokens.spacingVerticalXXS } * -1) calc(${ tokens.spacingHorizontalXS } * -1)`,
        padding: `${ tokens.spacingVerticalXXS } ${ tokens.spacingHorizontalXS }`,
        textDecorationLine: "none",
        transitionDuration: tokens.durationFaster,
        transitionProperty: "background-color",
        transitionTimingFunction: tokens.curveEasyEase,

        ":hover":
        {
            backgroundColor: tokens.colorSubtleBackgroundHover,
            textDecorationLine: "none"
        },

        ":hover:active":
        {
            backgroundColor: tokens.colorSubtleBackgroundPressed,
            textDecorationLine: "none"
        }
    }
});

/** {@inheritDoc Link} */
export type LinkProps = FluentLinkProps;

export/**
       * A hyperlink styled like a WinUI 3 `HyperlinkButton`, in place of Fluent UI's
       * default underlined link. Behaves identically to Fluent UI's `Link`: accepts the
       * same props, renders as an `<a>` when given `href`, and as a `<button>` otherwise.
       *
       * @category Component
       * @since 1.0.0
       */
const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
    ({ className, ...Rest }: LinkProps, Ref) =>
    {
        const Styles = UseStyles();

        return (
            <FluentLink
                { ...Rest }
                className={ mergeClasses(Styles.Root, className) }
                ref={ Ref as React.Ref<never> } />
        );
    }
);

Link.displayName = "Link";
