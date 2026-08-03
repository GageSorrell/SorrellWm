/**
 * A button with variant/size styling built on Base UI's unstyled `Button` primitive.
 *
 * @module @sorrell/ui/Button
 *
 * @file      Button.tsx
 * @author    Gage Sorrell <gage@sorrell.sh>
 * @copyright (c) 2026 Gage Sorrell
 * @license   MIT
 */

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { Cn } from "./ClassName.js";

const ButtonBaseClassName =
    "group/button aria-invalid:border-destructive aria-invalid:ring-destructive/20 " +
    "dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 inline-flex shrink-0 " +
    "items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm " +
    "font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring " +
    "focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 " +
    "aria-invalid:ring-3 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";

const ButtonVariants = cva(
    ButtonBaseClassName,
    {
        variants:
        {
            size:
            {
                default:
                    "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
                icon: "size-8",
                "icon-lg": "size-9",
                "icon-sm":
                    "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
                "icon-xs":
                    "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg " +
                    "[&_svg:not([class*='size-'])]:size-3",
                lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
                sm:
                    "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] " +
                    "in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 " +
                    "has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
                xs:
                    "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs " +
                    "in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 " +
                    "has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3"
            },
            variant:
            {
                default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
                destructive:
                    "bg-destructive/10 text-destructive hover:bg-destructive/20 " +
                    "focus-visible:border-destructive/40 focus-visible:ring-destructive/20 " +
                    "dark:bg-destructive/20 dark:hover:bg-destructive/30 " +
                    "dark:focus-visible:ring-destructive/40",
                ghost:
                    "hover:bg-muted aria-expanded:bg-muted dark:hover:bg-muted/50 hover:text-foreground " +
                    "aria-expanded:text-foreground",
                link: "text-primary underline-offset-4 hover:underline",
                outline:
                    "hover:bg-muted aria-expanded:bg-muted dark:border-input dark:bg-input/30 " +
                    "dark:hover:bg-input/50 border-border bg-background hover:text-foreground " +
                    "aria-expanded:text-foreground",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80 " +
                    "aria-expanded:bg-secondary aria-expanded:text-secondary-foreground"
            }
        },
        defaultVariants:
        {
            size: "default",
            variant: "default"
        }
    }
);

/** {@inheritDoc Button} */
export type ButtonProps = ButtonPrimitive.Props & VariantProps<typeof ButtonVariants>;

/**
 * A button with `default`/`outline`/`secondary`/`ghost`/`destructive`/`link` variants and
 * a range of sizes, including square icon-only sizes. Renders as an `<a>` when given `href`
 * (via Base UI's `render` prop) and as a `<button>` otherwise.
 *
 * @category Component
 * @since 1.0.0
 */
export const Button = (
    { className: ClassName, size: Size = "default", variant: Variant = "default", ...Rest }: ButtonProps
): React.JSX.Element =>
{
    return (
        <ButtonPrimitive
            className={ Cn(ButtonVariants({ className: ClassName, size: Size, variant: Variant })) }
            data-slot="button"
            { ...Rest } />
    );
};

export { ButtonVariants };
