/**
 * A unified link component covering inline text links, navigation links, footer links, and
 * subtle/icon links, with automatic `target="_blank"` for external hrefs.
 *
 * @module @sorrell/ui/Link
 *
 * @file      Link.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { Cn } from "./ClassName.js";

/**
 * ## Variant guide
 *
 * | variant | use case                                              |
 * |---------|--------------------------------------------------------|
 * | inline  | Body text links — underlined                           |
 * | nav     | Header nav — subtle bottom-border on hover              |
 * | footer  | Footer links — muted text, border-bottom on hover       |
 * | subtle  | Breadcrumbs, attributions — muted → full-strength on hover |
 * | icon    | Social/icon-only links — muted → full-strength on hover |
 */
const LinkVariants = cva(
    "transition-colors",
    {
        defaultVariants:
        {
            variant: "inline"
        },
        variants:
        {
            variant:
            {
                footer:
                    "border-b border-transparent text-sm leading-relaxed font-medium text-zinc-400 " +
                    "hover:border-current hover:text-white",
                icon: "text-zinc-400 hover:text-white",
                inline: "text-white underline underline-offset-2 hover:text-zinc-300",
                nav:
                    "border-b border-transparent text-sm font-medium text-zinc-400 " +
                    "hover:border-current hover:text-white",
                subtle: "text-sm text-zinc-400 hover:text-white"
            }
        }
    }
);

type LinkVariantProps = VariantProps<typeof LinkVariants>;

/** Props for {@link Link}. */
export type LinkProps = {
    readonly active?: boolean;
    readonly children: ReactNode;
    readonly className?: string;
    readonly href: string;
} & LinkVariantProps & Omit<ComponentPropsWithoutRef<"a">, "className">;

const ActiveClassByVariant: Record<NonNullable<LinkVariantProps["variant"]>, string> =
    {
        footer: "border-transparent text-white",
        icon: "text-white",
        inline: "",
        nav: "border-white text-white",
        subtle: "text-white"
    };

/**
 * Renders an `<a>` styled per `variant`. Links whose `href` starts with `http` automatically
 * receive `target="_blank" rel="noopener noreferrer"`.
 *
 * @category Component
 * @since 1.0.0
 */
export const Link = (
    {
        active: Active,
        children: Children,
        className: ClassName,
        href: Href,
        variant: Variant,
        ...Rest
    }: LinkProps
): React.JSX.Element =>
{
    const IsExternal = Href.startsWith("http");
    const ActiveClass = Active === true ? ActiveClassByVariant[Variant ?? "inline"] : "";

    return (
        <a
            className={ Cn(LinkVariants({ variant: Variant }), ClassName, ActiveClass) }
            href={ Href }
            { ...(IsExternal ? { rel: "noopener noreferrer", target: "_blank" } : {}) }
            { ...Rest }>
            { Children }
        </a>
    );
};

export { LinkVariants };
